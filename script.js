'use strict';

const questions = [
  {
    text: "太陽（たいよう）はどの方角（ほうがく）からのぼりますか？",
    choices: [
      "東（ひがし）", "西（にし）", "南（みなみ）", "北（きた）",
      "南東（なんとう）", "北東（ほくとう）", "南西（なんせい）", "北西（ほくせい）"
    ],
    correct: 0,
    explanation: "太陽は東からのぼって西にしずみます。これは地球が西から東へ自転しているからです。"
  },
  {
    text: "虹（にじ）は何色（なにいろ）からできていますか？",
    choices: ["3色", "4色", "5色", "6色", "7色", "8色", "9色", "10色"],
    correct: 4,
    explanation: "虹は赤・だいだい・黄・緑・青・藍（あい）・紫（むらさき）の7色からできています。"
  },
  {
    text: "日本でいちばん大きな湖（みずうみ）はどれですか？",
    choices: [
      "霞ヶ浦（かすみがうら）", "中禅寺湖（ちゅうぜんじこ）",
      "琵琶湖（びわこ）",       "猪苗代湖（いなわしろこ）",
      "洞爺湖（とうやこ）",     "阿寒湖（あかんこ）",
      "浜名湖（はまなこ）",     "諏訪湖（すわこ）"
    ],
    correct: 2,
    explanation: "琵琶湖は滋賀県にある日本でいちばん大きな湖です。面積は約670平方キロメートルあります。"
  },
  {
    text: "人のからだで、血液（けつえき）を全身に送り出している臓器（ぞうき）はどれですか？",
    choices: [
      "肺（はい）", "胃（い）", "心臓（しんぞう）", "肝臓（かんぞう）",
      "腎臓（じんぞう）", "脳（のう）", "脾臓（ひぞう）", "すい臓"
    ],
    correct: 2,
    explanation: "心臓はポンプのようにちぢんだりふくらんだりして血液を全身に送り出しています。1日に約10万回も動いています。"
  },
  {
    text: "こん虫（こんちゅう）のあしは何本（なんぼん）ですか？",
    choices: ["2本", "3本", "4本", "5本", "6本", "7本", "8本", "10本"],
    correct: 4,
    explanation: "こん虫のあしは必ず6本です。クモは8本、ムカデはもっとたくさんのあしを持っていますが、こん虫は6本がきまりです。"
  }
];

let currentIndex = 0;
let score = 0;
let answered = false;

const quizScreen   = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionNum  = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const choicesGrid  = document.getElementById('choices-grid');
const feedback     = document.getElementById('feedback');
const nextBtn      = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const starsEl      = document.getElementById('stars');
const scoreText    = document.getElementById('score-text');
const scoreMessage = document.getElementById('score-message');
const catAnimation = document.getElementById('cat-animation');
const retryBtn     = document.getElementById('retry-btn');

function loadQuestion() {
  answered = false;
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextBtn.classList.add('hidden');

  const q = questions[currentIndex];
  questionNum.textContent = `問題 ${currentIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  questionText.textContent = q.text;

  choicesGrid.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = `${i + 1}. ${choice}`;
    btn.addEventListener('click', () => selectAnswer(i));
    choicesGrid.appendChild(btn);
  });
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const buttons = choicesGrid.querySelectorAll('.choice-btn');

  buttons.forEach(btn => (btn.disabled = true));
  buttons[q.correct].classList.add('correct');

  if (index === q.correct) {
    score++;
    buttons[index].classList.add('selected-correct');
    feedback.textContent = `⭕ 正解！　${q.explanation}`;
    feedback.className = 'feedback correct-feedback';
  } else {
    buttons[index].classList.add('selected-incorrect');
    feedback.textContent = `❌ 不正解…　正解は「${q.choices[q.correct]}」でした。　${q.explanation}`;
    feedback.className = 'feedback incorrect-feedback';
  }

  nextBtn.classList.remove('hidden');
  nextBtn.textContent =
    currentIndex < questions.length - 1 ? '次の問題へ →' : '結果を見る →';
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const total = questions.length;
  starsEl.textContent = '⭐'.repeat(score) + '☆'.repeat(total - score);
  scoreText.textContent = `${total}問中 ${score}問 正解！`;
  scoreMessage.textContent = getScoreMessage(score, total);

  if (score >= 4) {
    catAnimation.classList.remove('hidden');
    playFanfare();
  }
}

function getScoreMessage(s, total) {
  if (s === total) return '全問正解！パーフェクトです！🌟';
  if (s >= 4)      return 'すごい！よくできました！🎉';
  if (s >= 3)      return 'もう少し！次はもっと上を目指そう！👍';
  if (s >= 2)      return 'がんばりました！もう一度挑戦してみよう！';
  return           'もう一度チャレンジしてみよう！💪';
}

function playFanfare() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  try {
    const ctx = new Ctx();

    // ファンファーレ：3連符上昇 → C メジャーアルペジオ → フィナーレ
    const notes = [
      { freq: 392.00, start: 0.00, dur: 0.12 },  // G4
      { freq: 392.00, start: 0.13, dur: 0.12 },  // G4
      { freq: 392.00, start: 0.26, dur: 0.12 },  // G4
      { freq: 523.25, start: 0.42, dur: 0.20 },  // C5
      { freq: 659.25, start: 0.64, dur: 0.20 },  // E5
      { freq: 783.99, start: 0.86, dur: 0.20 },  // G5
      { freq: 1046.50, start: 1.12, dur: 0.60 }, // C6（フィナーレ）
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + start;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.08);
      osc.start(t);
      osc.stop(t + dur + 0.12);
    });
  } catch (_) {
    // Web Audio API が利用できない場合は無音で続行
  }
}

retryBtn.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  answered = false;
  catAnimation.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  loadQuestion();
});

loadQuestion();
