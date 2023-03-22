import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connection } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"
import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { posts,users
 } from "./data/index.js";
// Configuration
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FIle Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({storage})

//  Routes with files
app.post('/auth/register', upload.single("picture"), register);
app.post("/posts",verifyToken, upload.single("picture"),createPost)
// routes
app.use("/auth", authRoutes)
app.use("/users", usersRoutes)
app.use("/posts", postRoutes)
//  Mongoose setup
const port = process.env.port || 8080;
app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to DB sucessfully")
        // Post.insertMany(posts)
        // User.insertMany(users)
    } catch (error) {
        console.log(error)
    }
})