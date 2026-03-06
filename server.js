import express from "express";
import catRouter from "./routes/catRouter.js";
// import path from "path";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/cats', catRouter);

// Setup static folder for frontend files
// app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.send('Welcome to the Volunteer Catabase!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});