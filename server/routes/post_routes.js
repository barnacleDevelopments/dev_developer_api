/*
AUTHOR: Devin Davis
DATE: January 3st, 2021
FILE: post_routes.js
*/

// DEPENDENCIES
import express from "express";
import * as yup from "yup";
import sanitizeHtml from "sanitize-html";
// MODELS
import Post from "../models/post_model";
import Category from "../models/category_model";

// MIDDLEWARE
import jwtCheck from "../middleware/jwt_token_check";
import checkPermissions from "../middleware/jwt_permission_check";


// VALIDATION SCHEMAS 

/*
=================
POST ROUTES
=================
*/
const router = express.Router();

//retrieve all posts
router.get("/", (req, res) => {
    // query all posts
    Post.find({}, (err, blogs) => {
        if (!err) {
            res.status(200).json({ data: blogs, status: "success" });
            console.log("Retrieved posts from database.")
        } else {
            res.status(500).send({
                status: "error",
                message: "Failed to find items in database."
            });
        }
    });
});

// retrieve one post
router.get("/:id", (req, res) => {
    const blogId = req.params.id;  // get blog id
    // query single blog by id
    Post.findOne({ _id: blogId }, (err, blog) => {
        if (!err) {
            res.status(200).json({ data: blog, status: "success" });
        } else {
            res.status(500).send({
                status: "error",
                message: "Failed to find item in database."
            });
        }
    });
});

// create one post 
router.post("/create/:catId", [jwtCheck, checkPermissions(["create:post"])], (req, res) => {
    let body = req.body; // request body
    const catId = req.params.catId; // category id

    body.content = sanitizeHtml(body.content);

    // create new post
    body.catId = catId;

    Post.create(body, (err, post) => {
        if (!err) {
            // find category by id and update its post list
            Category.findOne({ _id: catId }, (err, cat) => {
                if (!err) {
                    let newPostArr = cat.posts // current category post array
                    newPostArr.push(post._id) // push new post into categoires post array
                    // replace old category list with new list
                    Category.findByIdAndUpdate(catId, { posts: newPostArr }, (err, cat) => {
                        if (!err) {
                            res.status(201).json({ data: post, status: "success" });
                        } else {
                            res.status(500).json({
                                status: "error",
                                message: "Failed to update item in database."
                            });
                        }
                    });
                } else {
                    res.status(500).json({
                        status: "error",
                        message: "Failed to find item in database."
                    });
                }
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to add item to database."
            });
        }
    });
});

// create a draft post
router.post("/create/draft", [jwtCheck, checkPermissions(["create:post"])], (req, res, next) => {
    let body = req.body;
    body.isDraft = true
    body.content = sanitizeHtml(body.content)

    Category.create(body, (err, post) => {
        if (!err) {
            res.status(201).json(post);
        } else {
            res.sendStatus(500);
        }
    });
});

// update one post
router.put("/update/:id", [jwtCheck, checkPermissions(["update:post"])], (req, res) => {
    const body = req.body; // request body
    const postId = req.params.id; // post id

    body.content = sanitizeHtml(body.content)
    // update post
    Post.findByIdAndUpdate(postId, body, {
        new: true
    }, (err, post) => {
        if (!err) {
            res.status(201).json({ data: post, status: "success" })
        } else {
            res.status(500).send({
                status: "failure",
                message: "Failed to update item in database."
            });
        }
    });
});

// delete one post
router.delete("/delete/:postId/:catId", [jwtCheck, checkPermissions(["delete:post"])], (req, res) => {
    const postId = req.params.postId; // post id
    const catId = req.params.catId; // category id

    Post.findOneAndDelete({ _id: postId }, (err, post) => {
        if (!err) {
            // retrieve posts of post's category
            Category.findById(catId, (err, cat) => {
                if (!err) {
                    // filter out deleted post
                    const posts = cat.posts.filter((id) => id != postId);

                    // update category's posts
                    Category.findByIdAndUpdate(catId, { posts: posts }, (err, cat) => {
                        if (!err) {
                            res.status(200).json({
                                status: "success",
                                message: "Removed item from database."
                            });
                        } else {
                            res.status(500).json({
                                status: "failure",
                                message: "Failed to update item in database."
                            });
                        }
                    });
                } else {
                    res.status(500).json({
                        status: "failure",
                        message: "Failed to find item in database."
                    });
                }
            });
        } else {
            res.status(500).json({
                status: "failure",
                message: "Failed to delete item in database."
            });
        }
    });
});

export default router;