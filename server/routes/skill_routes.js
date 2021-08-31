/*
AUTHOR: Devin Davis
DATE: July 25th, 2021
FILE: projects_routes.js
*/

// DEPENDENCIES
import express from "express";
import * as yup from "yup";
import sanitizeHtml from "sanitize-html";

// MODELS
import Skill from "../models/skill_model.js";

// VALIDATION SCHEMAS 
let newProjectSchema = yup.object().shape({
    name: yup.string().required().min(5).max(15),
    desc: yup.string().required().min(50)
});

const router = express.Router();
//retrieve all skill
router.get("/", (req, res) => {
    // query all skill
    Skill.find({}, (err, skills) => {
        if (!err) {
            res.status(200).json({ data: skills, status: "success" });
        } else {
            res.status(500).send({
                status: "error",
                message: "Failed to find skills in database."
            })
        }
    })
});

export default router;