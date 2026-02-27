import express from "express";

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Welcome to the Volunteer Catabase!');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});
