/*
AUTHOR: Devin Davis
DATE: April 18th, 2021
FILE: projects_model.js
*/

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    desc: String,
    date: String,
    link: String,
    image: {
        data: Buffer,
        contentType: String
    }
});

const Project = mongoose.model("project", projectSchema);

export default Project;