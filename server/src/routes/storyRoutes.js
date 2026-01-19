const express = require("express");
const router = express.Router();

const storyService = require("../services/storyService");

// GET /api/story/start
router.get("/start", (req, res) => {
  const scene = storyService.getStartScene();
  res.json(scene);
});

// GET /api/story/scene/scene2
router.get("/scene/:id", (req, res) => {
  const scene = storyService.getSceneById(req.params.id);
  if (!scene) {
    return res.status(404).json({ ok: false, message: "Scene not found" });
  }
  res.json(scene);
});

// POST /api/story/choose
router.post("/choose", (req, res) => {
  const result = storyService.chooseNext(req.body.sceneId, req.body.choiceIndex);

  if (!result.ok && result.status) {
    return res.status(result.status).json({ ok: false, message: result.message });
  }

  res.json(result);
});


module.exports = router;
