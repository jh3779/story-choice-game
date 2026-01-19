const express = require("express");
const storyRoutes = require("./routes/storyRoutes");
const progressRoutes = require("./routes/progressRoutes");


const app = express();

// JSON 형태로 보내는 요청(body)을 읽을 수 있게 해줌
app.use(express.json());

// 서버 기본 확인용
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// 스토리 관련 API는 /api/story 로 시작하게 묶음
app.use("/api/story", storyRoutes);
app.use("/api/progress", progressRoutes);

module.exports = app;
