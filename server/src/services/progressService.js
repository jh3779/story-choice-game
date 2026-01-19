const storyService = require("./storyService");

// 메모리 저장소: 서버 껐다 켜면 초기화됨(지금 단계에 딱 좋음)
const userProgress = new Map();
// 예: userProgress.get("seyoung") -> "scene2"

function start(userId) {
  if (!userId) {
    return { ok: false, status: 400, message: "userId가 필요해요" };
  }

  const startScene = storyService.getStartScene();
  userProgress.set(userId, startScene.id);

  return { ok: true, userId, scene: startScene };
}

function getCurrent(userId) {
  if (!userId) {
    return { ok: false, status: 400, message: "userId가 필요해요" };
  }

  const sceneId = userProgress.get(userId);
  if (!sceneId) {
    return { ok: false, status: 404, message: "진행 데이터가 없어요. start부터 해주세요." };
  }

  const scene = storyService.getSceneById(sceneId);
  if (!scene) {
    return { ok: false, status: 500, message: "저장된 sceneId가 스토리 데이터에 없어요" };
  }

  return { ok: true, userId, scene };
}

function choose(userId, choiceIndex) {
  if (!userId || choiceIndex === undefined) {
    return { ok: false, status: 400, message: "userId와 choiceIndex가 필요해요" };
  }

  const currentResult = getCurrent(userId);
  if (!currentResult.ok) return currentResult;

  const currentScene = currentResult.scene;

  const result = storyService.chooseNext(currentScene.id, choiceIndex);

  // 엔딩이면 진행은 그대로 두거나(원하면) 지울 수도 있음
  if (result.ok && result.end === true) {
    return { ok: true, end: true, userId, scene: result.scene, message: result.message };
  }

  if (!result.ok && result.status) {
    return result;
  }

  // 다음 장면으로 진행 저장
  userProgress.set(userId, result.next.id);

  return {
    ok: true,
    end: false,
    userId,
    from: result.from,
    choice: result.choice,
    scene: result.next
  };
}

module.exports = {
  start,
  getCurrent,
  choose,
};
