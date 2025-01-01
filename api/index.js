import express from "express";
import cors from "cors";
import path from "path";
import registerRoutes from "./util/router.js";

const app = express();

app.use(
  cors({
    // origin: "http://localhost:3152", // Allow requests from your React app
    // optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  req.id = Array(12)
    .fill(null)
    .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
    .join("");

  next();
});

app.use((req, res, next) => {
  // if (process.env.NODE_ENV !== "test") {
  console.log(`[${req.id}][REQUEST]`, req.method, req.url);
  // }
  next();
});

app.use(express.json());

await registerRoutes(app, path.join(process.cwd(), "routes"));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
