"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = require("./routes/postsRoutes"); // Import the router module for posts
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json()); // Use the express.json() middleware for parsing JSON requests
app.use("/api", router); // Use the router for handling routes under the "/api" path
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error to the console
    res.status(500).json({ error: "Internal Server Error" }); // Send a 500 Internal Server Error response
});
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Log a message indicating the server is running
});
