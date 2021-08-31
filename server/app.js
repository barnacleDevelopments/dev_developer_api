/*
AUTHOR: Devin Davis
DATE: January 1st, 2021
FILE: app.js
*/

// DEPENDENCIES
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

// ROUTES
import postRoutes from "./routes/post_routes.js";
import categoryRoutes from "./routes/category_routes.js";
import commentRoutes from "./routes/comment_routes.js";
import projectRoutes from "./routes/project_routes.js";
import mailRoutes from "./routes/mail_routes.js";
import skillRoutes from "./routes/skill_routes.js";

// ENV VARIABLES
const PORT = process.env.PORT;

const app = express();

// CONNECT TO ATLAS CLUSTER
mongoose.connect(
  'mongodb+srv://test_user:ZKZ7hgywzunzT5xU@devdeveloperblog.1t4lu.mongodb.net/devdeveloperBlog?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to database!");
});

// +++++++++++++++
// MIDDLEWARE 
// +++++++++++++++

// CROSS ORGIN REQUEST SETTINGS
var whitelist = ['https://blog.devdeveloper.ca', 'https://devdeveloper.ca', 'http://localhost:5000', 'http://localhost:8080']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use("*", cors(corsOptionsDelegate));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SET HTTP HEADERS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'", "https://dev-qkxpd7xc.auth0.com/"],
      "script-src": ["'self'", "'unsafe-eval'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "script-src-elem": ["'self'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "connect-src": ["'self'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "style-src": ["'self'", "'unsafe-inline'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "font-src": ["'self'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "img-src": ["'self'", "data:", "'unsafe-eval'", "'unsafe-inline'", "https://dev-qkxpd7xc.auth0.com/"]
    },
    frameguard: "deny"
  }
}));

// ++++++++++++++++++
// INITIALIZE ROUTES
// ++++++++++++++++++

app.use("/posts", postRoutes);
app.use("/categories", categoryRoutes);
app.use("/comments", commentRoutes);
app.use("/projects", projectRoutes);
app.use("/mail", mailRoutes);
app.use("/skills", skillRoutes)

app.get("*", ({ }, res) => {
  res.send("Welcome to the DevDeveloper API!");
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

