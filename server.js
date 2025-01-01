const express = require("express"); // expressをつかう
const app = express(); // instance?

const authRoute = require("./routers/auth");
const postRoute = require("./routers/posts");
const usersRoute = require("./routers/users");

// CORSポリシー対策
const cors = require("cors");

// api express get method
// app.get("/", (req, res) => {
//   res.send("<h1>hello</h1>");
// });

require("dotenv").config();
const PORT = 4000;

app.use(cors());
// expressでjsonをうけとる
app.use(express.json());

// apiを呼び出す
app.use("/api/auth", authRoute); // /registerなどのurlがくる
app.use("/api/posts", postRoute);
app.use("/api/users", usersRoute);

// サーバー立ち上げ npm run dev
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
