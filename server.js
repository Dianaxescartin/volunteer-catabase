import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import catRouter from "./routes/catRouter.js";

const app = express();
const port = 8080;

// Routes
app.use('/api/cats', catRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup static folder for frontend files
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});