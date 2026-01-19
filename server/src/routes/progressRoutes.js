const express = require("express");
const router = express.Router();

const progressService = require("../services/progressService");

// ✅ 진행 시작(초기화)
// POST /api/progress/start
// body: { "userId": "testUser" }
router.post("/start", (req, res) => {
  const result = progressService.start(req.body.userId);

  if (!result.ok && result.status) {
    return res.status(result.status).json({ ok: false, message: result.message });
  }

  res.json(result);
});

// ✅ 현재 진행 조회
// GET /api/progress?userId=testUser
router.get("/", (req, res) => {
  const result = progressService.getCurrent(req.query.userId);

  if (!result.ok && result.status) {
    return res.status(result.status).json({ ok: false, message: result.message });
  }

  res.json(result);
});

// ✅ 선택해서 진행 업데이트
// POST /api/progress/choose
// body: { "userId": "testUser", "choiceIndex": 0 }
router.post("/choose", (req, res) => {
  const result = progressService.choose(req.body.userId, req.body.choiceIndex);

  if (!result.ok && result.status) {
    return res.status(result.status).json({ ok: false, message: result.message });
  }

  res.json(result);
});

module.exports = router;
