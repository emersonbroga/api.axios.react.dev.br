require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fileupload = require("express-fileupload");
const { generate } = require("./services/users");

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

const usersRouter = require("./routes/users");

const corsOptions = {
  exposedHeaders: "*",
  origin: "*",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(fileupload({ safeFileNames: true, preserveExtension: true, createParentPath: true }));

app.use("/v1/users/", usersRouter);

app.get("/generate", async (req, res) => {
  try {
    await generate("./src/data/users.json");

    return res.send("Users generated!");
  } catch (e) {
    console.log(e);
    return res.status(500).send("Error generating users!");
  }
});

app.use("/", (req, res) => {
  return res.send(`Api is running at ${BASE_URL}!`);
});

app.listen(PORT, () => {
  console.log(`Api is running at ${BASE_URL} and port ${PORT}!`);
});

app.use((error, req, res, next) => {
  if (process.env.ENV !== "production") {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }

  return res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
