import express from "express";
import { VerifyToken } from "./middleware/VerifyToken.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const STATIC_FILES_PATH = path.resolve(__dirname, "..", "frontend", "build");

dotenv.config(); // Configure dotenv to access the env variables

// Every time frontend tries to serve this (backend), it will automatically be stored in public folder.
// app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(STATIC_FILES_PATH)));

// For later setting environment variables, else we use 3001 as default port.
const port = process.env.PORT || 3001;

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(VerifyToken);

// app.get('/api/exampletest', (req, res) => {
//     console.log("Req found");
//     res.json({info:'Hello World'} || {});
// });

app.listen(port, () => {
  console.log(`Example Express app listening at http://localhost:${port}`);
});

//Anything that does not match the above api routes will be rerouted to the static pages (frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../frontend/build/index.html"));
});
