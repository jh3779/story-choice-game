const story = require("../data/story.json");

function getStartScene() {
  const startId = story.start;
  return story.scenes[startId];
}

function getSceneById(id) {
  return story.scenes[id] || null;
}

function chooseNext(sceneId, choiceIndex) {
  if (!sceneId || choiceIndex === undefined) {
    return { ok: false, status: 400, message: "sceneId와 choiceIndex가 필요해요" };
  }

  const current = getSceneById(sceneId);
  if (!current) {
    return { ok: false, status: 404, message: "현재 장면이 없어요" };
  }

  // 엔딩 처리
  if (!Array.isArray(current.choices) || current.choices.length === 0) {
    return { ok: true, end: true, scene: current, message: "엔딩 장면이에요" };
  }

  const idx = Number(choiceIndex);
  if (Number.isNaN(idx) || idx < 0 || idx >= current.choices.length) {
    return { ok: false, status: 400, message: "choiceIndex가 유효하지 않아요" };
  }

  const nextId = current.choices[idx].next;
  const nextScene = getSceneById(nextId);

  if (!nextScene) {
    return { ok: false, status: 500, message: "다음 장면 데이터가 없어요(스토리 데이터 확인 필요)" };
  }

  return {
    ok: true,
    end: false,
    from: sceneId,
    choice: current.choices[idx].text,
    next: nextScene,
  };
}

module.exports = {
  getStartScene,
  getSceneById,
  chooseNext,
};
