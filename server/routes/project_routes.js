/*
AUTHOR: Devin Davis
DATE: April 18th, 2021
FILE: projects_routes.js
*/

// DEPENDENCIES
import express from "express";
import * as yup from "yup";
import sanitizeHtml from "sanitize-html";

// MODELS
import Project from "../models/project_model.js";

// MIDDLEWARE
import jwtCheck from "../middleware/jwt_token_check.js";
import checkPermissions from "../middleware/jwt_permission_check.js";

// VALIDATION SCHEMAS 
let newProjectSchema = yup.object().shape({
    name: yup.string().required().min(5).max(15),
    desc: yup.string().required().min(50)
});

const router = express.Router();
//retrieve all project
router.get("/", (req, res) => {
    // query all project
    Project.find({}, (err, projects) => {
        if (!err) {
            res.status(200).json({ data: projects, status: "success" });
        } else {
            res.status(500).send({
                status: "error",
                message: "Failed to find projects in database."
            })
        }
    })
});

export default router;