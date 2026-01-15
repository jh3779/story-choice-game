// --- [Data Layer] ---
let currentState = {
    stageIndex: 0, 
    money: 50,     
    karma: 50,
    stress: 50
};

const stageData = [
    {
        id: 1,
        text: "중요한 면접 10분 전,\n교차로 진입 직전 황색 신호등이 켜졌다.\n\n밟으면 통과, 멈추면 지각이다.",
        choices: [
            { text: "A. 풀악셀을 밟는다", money: 0, karma: -10, stress: 20 },
            { text: "B. 급정거한다", money: 0, karma: 10, stress: -10 }
        ]
    },
    {
        id: 2,
        text: "점심시간, 동기가 밥을 사달라고 한다.\n내 지갑 사정도 넉넉지 않은데...",
        choices: [
            { text: "A. 쿨하게 내가 산다! (-3만)", money: -30, karma: 10, stress: 0 },
            { text: "B. 더치페이 하자고 한다", money: 0, karma: -5, stress: 5 }
        ]
    },
    {
        id: 3,
        text: "업무 중 실수로 중요한 파일을 지웠다.\n아무도 본 사람은 없다.",
        choices: [
            { text: "A. 솔직하게 보고한다", money: 0, karma: 20, stress: 30 },
            { text: "B. 몰래 복구를 시도한다", money: 0, karma: -20, stress: 10 }
        ]
    },
    {
        id: 4,
        text: "퇴근길, 쓰레기를 줍는 할머니의\n리어카가 쓰러졌다.",
        choices: [
            { text: "A. 모른 척 지나간다", money: 0, karma: -30, stress: -10 },
            { text: "B. 가서 도와드린다", money: 0, karma: 30, stress: 10 }
        ]
    }
];

const endings = [
    { condition: (s) => s.karma >= 80, title: "평온한 밤 (Happy)", desc: "당신은 오늘 하루 떳떳하게 살았습니다. 두 다리 뻗고 편안하게 잠듭니다." },
    { condition: (s) => s.stress >= 90, title: "불면의 밤 (Bad)", desc: "오늘 하루 너무 많은 스트레스를 받았습니다. 생각이 많아 잠이 오지 않습니다." },
    { condition: (s) => s.money <= 10, title: "배고픈 밤 (Poor)", desc: "지갑은 텅 비었지만, 그래도 하루를 버텨냈습니다. 내일은 더 나아지겠죠." },
    { condition: (s) => true, title: "그저 그런 밤 (Normal)", desc: "특별할 것 없는 하루였습니다. 내일도 비슷한 하루가 반복되겠죠." }
];

// --- [Logic Layer] ---

// 1. 화면 전환 유틸리티
function switchScreen(screenId) {
    document.querySelectorAll('.screen-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(screenId);
    target.classList.remove('hidden');
    target.classList.remove('fade-in');
    void target.offsetWidth; 
    target.classList.add('fade-in');
}

// 2. 현재 시간 가져오기 함수 (요청하신 기능)
function getNowTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

// 3. 게임 시작
function startGame() {
    currentState = { stageIndex: 0, money: 50, karma: 50, stress: 50 };
    switchScreen('page-game');
    
    // 시간 업데이트
    document.getElementById('time-indicator').innerText = getNowTime();
    renderStage();
}

// 4. 스테이지 그리기
function renderStage() {
    const index = currentState.stageIndex;
    
    if (index >= stageData.length) {
        showEnding();
        return;
    }

    const data = stageData[index];

    // 스테이지 정보 업데이트
    document.getElementById('stage-indicator').innerText = `Stage ${index + 1} / ${stageData.length}`;
    
    // 시간 업데이트 (단계가 바뀔 때마다 시간도 갱신)
    document.getElementById('time-indicator').innerText = getNowTime();

    document.getElementById('scenario-text').innerText = data.text;

    const choicesArea = document.getElementById('choices-area');
    choicesArea.innerHTML = ''; 

    data.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn-primary'; 
        btn.innerText = choice.text;
        btn.onclick = () => selectChoice(choice);
        choicesArea.appendChild(btn);
    });
}

// 5. 선택 처리
function selectChoice(choice) {
    currentState.money += choice.money;
    currentState.karma += choice.karma;
    currentState.stress += choice.stress;
    currentState.stageIndex++;
    renderStage();
}

// 6. 결과 화면
function showEnding() {
    switchScreen('page-result');

    const ending = endings.find(e => e.condition(currentState));

    document.getElementById('ending-title').innerText = ending.title;
    document.getElementById('ending-desc').innerText = ending.desc;

    updateBar('val-money', 'bar-money', currentState.money);
    updateBar('val-karma', 'bar-karma', currentState.karma);
    updateBar('val-stress', 'bar-stress', currentState.stress);
}

function updateBar(textId, barId, value) {
    let safeValue = Math.max(0, Math.min(100, value));
    document.getElementById(textId).innerText = safeValue;
    document.getElementById(barId).style.width = safeValue + '%';
}

function goHome() {
    switchScreen('page-home');
}
