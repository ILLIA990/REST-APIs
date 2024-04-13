import express from 'express';
import fs from 'fs/promises';
const validatePostData = require ("../middlewares/validateData");
const router = express.Router();

// Function to read data from the JSON file
async function readData() {
    try {
        // Read the contents of the posts.json file
        const data: any = await (fs).readFile("./database/posts.json");
        // Parse the JSON data into a TypeScript object
        return JSON.parse(data);
    } catch (error) {
        // If an error occurs during reading or parsing, throw the error
        throw error;
    }
}

// GET ALL POSTS
router.get("/", async (req, res, next) => {
    try {
        // Call the readData function to retrieve the list of posts
        const data = await readData();
        // Send the retrieved data as the response
        res.status(200).send(data);
    } catch (error) {
        // If an error occurs during data retrieval or sending the response
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
    }
});

// GET POST BY ID
router.get("/post/:id", async (req, res, next) => {
    try {
        // Extract the post ID from the request parameters
        const postId = req.params.id;
        // Read data from the JSON file
        const data = await readData();

        // Find the post with the matching ID
        const post = data.find((post: { id: string; }) => post.id === postId);

        // If the post is not found, send a 404 response
        if (!post) {
            res.status(404).json({ error: "Post not found" });
        } else {
            // If the post is found, send it as the response
            res.status(200).send(post);
        }
    } catch (error) {
        // Handle errors by logging them and sending an error response
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
    }
});

// CREATE POST
router.post("/", validatePostData, async (req, res, next) => {
    try {
        const newPost = {
            id: Date.now().toString(), // Generate a unique ID for the new post
            username: req.body.username,
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
        };

        // Read the existing data
        const data = await readData();

        // Add the new post to the data
        data.push(newPost);

        // Write the updated data back to the JSON file
        await fs.writeFile("./database/posts.json", JSON.stringify(data));

        // Send a success response with the new post
        res.status(201).json(newPost);
    } catch (error) {
        // Handle errors by logging them to the console
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
    }
});

// UPDATE POST BY ID
router.put("/post/:id", validatePostData, async (req, res, next) => {
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
        const data = await readData();

        // Find the index of the post with the specified ID in the data array
        const postIndex = data.findIndex((post: { id: string; }) => post.id === postId);

        // If the post with the specified ID doesn't exist, return a 404 error
        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Update the post data with the new data using spread syntax
        data[postIndex] = {
            ...data[postIndex], // Keep existing data
            ...updatedData, // Apply updated data
        };

        // Write the updated data back
        await fs.writeFile("./database/posts.json", JSON.stringify(data));

        // Send a success response with the updated post
        res.status(200).json(data[postIndex]);
    } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
        next(error);
    }
});

// DELETE POST BY ID
router.delete("/post/:id", async (req, res, next) => {
    try {
        // Extract the post ID from the request parameters
        const postId = req.params.id;

        // Read the existing data
        const data = await readData();

        // Find the index of the post with the specified ID in the data array
        const postIndex = data.findIndex((post: { id: string; }) => post.id === postId);

        // If the post with the specified ID doesn't exist, return a 404 error
        if (postIndex === -1) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Remove the post from the data array using splice
        data.splice(postIndex, 1);

        // Write the updated data back to the data source (e.g., a JSON file)
        await fs.writeFile("./database/posts.json", JSON.stringify(data));

        // Send a success response with the JSON response indicating successful deletion
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(errorMessage);
        next(error);
    }
});

module.exports = router;