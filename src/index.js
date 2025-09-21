require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser())

const connectDB = require("./config/connectDB");
const { ed25519KeygenMiddleware } = require("./middlewares/rsa/key.js");
const db = connectDB();

const userRouter = require("./routes/auth.route.js");

app.get("/generate-keys", ed25519KeygenMiddleware);

app.get("/", async (req, res) => {
  try {
    await db.listCollections();
    console.log("hi dev firestore connected");
    res.send("hi dev firestore connected");
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
    console.log("hi dev, backend running but firebase not connected");
    res.send("hi dev, backend running but firebase not connected");
  }
});
app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
