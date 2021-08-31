/*
AUTHOR: Devin Davis
DATE: July 24th, 2021
FILE: comment_routes.js
*/

// DEPENDENCIES
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// CATEGORY ROUTES
dotenv.config();

const {
    MASTER_EMAIL,
    SMTP_HOST_EMAIL,
    SMTP_PASS
} = process.env;

const router = express.Router();

router.post("/", (req, res, next) => {
    const { from, subject, message } = req.body;
    let sendSuccessfull = true;
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user: SMTP_HOST_EMAIL,
            pass: SMTP_PASS
        }
    });

    transporter.sendMail({
        from: SMTP_HOST_EMAIL,
        to: "devins.d@protonmail.com",
        subject: `FREELANCE: ${subject}`,
        text: `You recieved a message from: ${from} - ${message}`,
    }).catch(() => sendSuccessfull = false);

    transporter.sendMail({
        from: SMTP_HOST_EMAIL,
        to: from,
        subject: `Thank You - DevDeveloper`,
        text: `This is an auto generated response. I will be in touch with you shortly.`,
    }).catch(() => sendSuccessfull = false);

    if (!sendSuccessfull) {
        res.status(500).send("Failed to send email. Please try again.")
    } else {
        res.status(200);
    }

});

export default router;