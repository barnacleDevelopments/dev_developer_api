/*
AUTHOR: Devin Davis
DATE: May 23rd, 2021
FILE: category_routes.js
*/


import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: String,
    catId: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    image: {
        data: Buffer,
        contentType: String
    }
});

const Post = mongoose.model("Post", postSchema);

export default Post;