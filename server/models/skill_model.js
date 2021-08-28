/*
AUTHOR: Devin Davis
DATE: April 20th, 2021
FILE: skills_model.js
*/

import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: String,
    desc: String,
    skillLevel: Number,
    link: String,
    image: String
});

const Skill = mongoose.model("skill", skillSchema);

export default Skill;