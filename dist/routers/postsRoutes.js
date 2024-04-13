"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const validatePostData = require("../middlewares/validateData");
const router = express_1.default.Router();
// Function to read data from the JSON file
function readData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the contents of the posts.json file
            const data = yield (promises_1.default).readFile("./database/posts.json");
            // Parse the JSON data into a TypeScript object
            return JSON.parse(data);
        }
        catch (error) {
            // If an error occurs during reading or parsing, throw the error
            throw error;
        }
    });
}
// GET ALL POSTS
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Call the readData function to retrieve the list of posts
        const data = yield readData();
        // Send the retrieved data as the response
        res.status(200).send(data);
    }
    catch (error) {
        // If an error occurs during data retrieval or sending the response
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
    }
}));
// GET POST BY ID
router.get("/post/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the post ID from the request parameters
        const postId = req.params.id;
        // Read data from the JSON file
        const data = yield readData();
        // Find the post with the matching ID
        const post = data.find((post) => post.id === postId);
        // If the post is not found, send a 404 response
        if (!post) {
            res.status(404).json({ error: "Post not found" });
        }
        else {
            // If the post is found, send it as the response
            res.status(200).send(post);
        }
    }
    catch (error) {
        // Handle errors by logging them and sending an error response
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
    }
}));
// CREATE POST
router.post("/", validatePostData, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = {
            id: Date.now().toString(), // Generate a unique ID for the new post
            username: req.body.username,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
        };
        // Read the existing data
        const data = yield readData();
        // Add the new post to the data
        data.push(newPost);
        // Write the updated data back to the JSON file
        yield promises_1.default.writeFile("./database/posts.json", JSON.stringify(data));
        // Send a success response with the new post
        res.status(201).json(newPost);
    }
    catch (error) {
        // Handle errors by logging them to the console
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
    }
}));
// UPDATE POST BY ID
router.put("/post/:id", validatePostData, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the post ID from the request parameters
        const postId = req.params.id;
        // Extract the updated data from the request body
        const updatedData = {
            username: req.body.username,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
        };
        // Read the existing data
        const data = yield readData();
        // Find the index of the post with the specified ID in the data array
        const postIndex = data.findIndex((post) => post.id === postId);
        // If the post with the specified ID doesn't exist, return a 404 error
        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Update the post data with the new data using spread syntax
        data[postIndex] = Object.assign(Object.assign({}, data[postIndex]), updatedData);
        // Write the updated data back
        yield promises_1.default.writeFile("./database/posts.json", JSON.stringify(data));
        // Send a success response with the updated post
        res.status(200).json(data[postIndex]);
    }
    catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
        next(error);
    }
}));
// DELETE POST BY ID
router.delete("/post/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the post ID from the request parameters
        const postId = req.params.id;
        // Read the existing data
        const data = yield readData();
        // Find the index of the post with the specified ID in the data array
        const postIndex = data.findIndex((post) => post.id === postId);
        // If the post with the specified ID doesn't exist, return a 404 error
        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Remove the post from the data array using splice
        data.splice(postIndex, 1);
        // Write the updated data back to the data source (e.g., a JSON file)
        yield promises_1.default.writeFile("./database/posts.json", JSON.stringify(data));
        // Send a success response with the JSON response indicating successful deletion
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.log(errorMessage);
        next(error);
    }
}));
module.exports = router;
