/*
AUTHOR: Devin Davis
DATE: January 3st, 2021
FILE: category_routes.js
*/

// DEPENDENCIES
import express from "express";
import * as yup from "yup"

// MODELS
import Category from "../models/category_model.js";
import Post from "../models/post_model.js";

// JWT MIDDLEWARE
import jwtCheck from "../middleware/jwt_token_check.js";
import checkPermissions from "../middleware/jwt_permission_check.js";

/*
=================
CATEGORY ROUTES
=================
*/

const router = express.Router();

// create validation schema 
const categorySchema = yup.object().shape({
    name: yup.string().required().min(4).max(20),
    desc: yup.string().required().min(16).max(50)
})

// retrieve all categories
router.get("/", (req, res) => {
    // retrieve all categories
    Category.find({}, (err, cats) => {
        if (!err) {
            res.status(200).json({ data: cats });
        } else {
            res.sendStatus(500);
        }
    });
});

// retrieve one category 
router.get("/:id", (req, res) => {
    const catId = req.params.id;
    // find one category by id
    Category.findOne({ _id: catId }, (err, cat) => {
        if (!err) {
            res.status(500).json({ data: cat, status: "success" });
        } else {
            res.status(200).json({ status: "error", message: err });
        }
    });
});

// retrieve posts of category
router.get("/posts/:id", (req, res) => {
    const catId = req.params.id;
    // find all posts associated with category
    Category.findById(catId)
        .populate("posts")
        .exec((err, cat) => {
            if (!err) {
                res.status(200).json({ data: cat.posts, status: "success" });
                console.log(`Posts retrieved from category with id: ${cat._id}`)
            } else {
                res.status(500).json({
                    status: "error",
                    message: err
                });
            }
        });
});

// create one category
router.post("/create", (req, res) => {
    const body = req.body;
    // validate incoming body against schema
    categorySchema.validate(body)
        .then(() => {
            // create category in database
            Category.create(body, (err, cat) => {
                if (!err) {
                    res.status(201).json({ data: cat });
                } else {
                    res.status(500).send("Failed to create category.");
                }
            })
        }).catch(() => {
            res.status(413).send("Failed to validate category.");
        });
});

// update one category
router.put("/update/:id", [jwtCheck, checkPermissions(["update:category"])], (req, res) => {
    const body = req.body;
    const id = req.params.id;

    // validate incoming body against schema
    categorySchema.validate(body)
        .then(() => {
            // find category in database and update it
            Category.findByIdAndUpdate(id, body, {
                new: true
            }, (err, cat) => {
                if (!err) {
                    res.status(201).json({ data: cat, status: "success" });
                } else {
                    res.status(500).send({ message: "Failed to update category." });
                }
            })
        }).catch(err => res.status(413).send({ message: err.message }));
});

// delete one category
router.delete("/delete/:id", [jwtCheck, checkPermissions(["delete:category"])], (req, res) => {
    const catId = req.params.id;
    // find category and delete it
    Category.findOneAndDelete({ _id: catId }, (err, cat) => {
        if (!err) {
            // delete all post of delete category
            Post.deleteMany({ catId: catId }, (err) => {
                if (!err) {
                    res.status(200).send({ message: "success" });
                } else {
                    res.status(500).send({ message: "Failed to delete posts of category." });
                }
            })
        } else {
            res.status(500).send({ message: "Failed to query category in database." });
        }
    });
});

export default router;