import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import { connectDB } from "./utils/db.utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import logger, { morganMiddleware } from "./logger";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";
import session from "express-session";
import passport from "./utils/passport";
import oauthRoutes from "./routes/social-auth";
// import FormData from "form-data";
// import axios from "axios";
const app = express();
const PORT = process.env.SERVER_PORT || 8080;
connectDB();
const apiProxy = createProxyMiddleware("/api", {
  target: "https://3z5n8hb7u8.execute-api.ap-south-1.amazonaws.com",
  changeOrigin: true,
});

const corsOptions = {
  // origin: "https://master.dwrud2cqgk3ja.amplifyapp.com",
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "access_token", // Replace with a secure random key for session encryption
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/api", apiProxy);
app.use(morganMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/oauth", oauthRoutes);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

app.get("/", (req, res) => {
  res.send("hello");
});

// app.get("/seed-db", async (req, res) => {
//   const imageCount = 45;
//   const imageWidths = Array.from(
//     { length: imageCount },
//     () => Math.floor(Math.random() * 1000) + 200
//   );
//   const imageHeights = Array.from(
//     { length: imageCount },
//     () => Math.floor(Math.random() * 1000) + 200
//   );
//   const imageUrls = Array.from(
//     { length: imageCount },
//     (_, i) => `https://picsum.photos/${imageWidths[i]}/${imageHeights[i]}`
//   );

//   const dataArr = [];
//   for (let i = 31; i < imageCount; i++) {
//     const response = await axios.get(imageUrls[i], {
//       responseType: "arraybuffer",
//     });
//     const buffer = Buffer.from(response.data, "binary");
//     const fd = new FormData();
//     fd.append(`image`, buffer, { filename: `image-${i}.jpg` });
//     fd.append(`title`, `Random Image ${i}`);
//     // fd.append(`user`, `64c68bd5a9390279e2f871f6`);
//     dataArr.push(fd);
//   }

//   const postPromises = [];
//   for (let i = 0; i < imageCount; i++) {
//     const fd = dataArr[i];
//     postPromises.push(axios.post("http://localhost:8080/post", fd, {}));
//   }

//   Promise.all(postPromises)
//     .then(() => {
//       res.send("Posts created successfully");
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error creating posts");
//     });
// });

app.listen(PORT, () => {
  logger.info(`SERVER IS RUNNIG AT ${PORT}`);
});
