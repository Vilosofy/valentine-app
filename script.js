const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");

const video = document.getElementById("mainVideo");
const gif = document.getElementById("mainGif");

/* FLOW */
let flow = 1; // 1 = ask, 2 = valentine, 3 = end

let yesWidth = 120;
let yesHeight = 44;

/* =========================
   POSITION SYSTEM
========================= */
let posX = 0;
let posY = 0;

/* =========================
   CLICK SYSTEM
========================= */
let noClickCount = 0;
const MOVE_PHASE = 3;

/* =========================
   DEVICE SYSTEM
========================= */
const isDesktop = window.matchMedia("(min-width: 768px)").matches;

/* =========================
   HOVER SYSTEM (DESKTOP)
========================= */
let hoverMoveCount = 0;
const MAX_HOVER_MOVES = 10;
let hoverEnabled = true;

/* JARAK GERAK DESKTOP (LEBIH JAUH) */
const HOVER_MAX_X = 420;
const HOVER_MAX_Y = 220;

/* =========================
   MOBILE MOVE SYSTEM
========================= */
let mobileMoveCount = 0;
const MAX_MOBILE_MOVES = 6;

/* =========================
   DESKTOP HOVER MOVE
========================= */
if (isDesktop) {
  noBtn.addEventListener("mouseenter", () => {
    if (hoverMoveCount >= MAX_HOVER_MOVES) return;
    if (flow === 3) return;

    const moveX = Math.random() * 700 - 350;
    const moveY = Math.random() * 420 - 210;

    posX += moveX;
    posY += moveY;

    posX = Math.max(-HOVER_MAX_X, Math.min(HOVER_MAX_X, posX));
    posY = Math.max(-HOVER_MAX_Y, Math.min(HOVER_MAX_Y, posY));

    noBtn.style.transition = "transform 0.55s cubic-bezier(.22,1,.36,1)";
    noBtn.style.transform = `translate(${posX}px, ${posY}px)`;

    hoverMoveCount++;
  });
}

/* =========================
   FLOW TEXTS
========================= */
const flow1NoTexts = [
  "hmm 🤔",
  "what?",
  "just one quick question",
  "promise 😌",
  "Yes",
];

const flow2NoTexts = [
  "really? 🥹",
  "are you sure? 🥲",
  "why nottt",
  "okay fine.",
  "Yes",
];

/* =========================
   RESET SYSTEM
========================= */
function resetButtons() {
  posX = 0;
  posY = 0;
  hoverMoveCount = 0;
  mobileMoveCount = 0;
  hoverEnabled = true;
  noClickCount = 0;

  noBtn.style.transition = "transform 0.4s ease";
  noBtn.style.transform = "translate(0px, 0px)";

  yesWidth = 120;
  yesHeight = 44;
  yesBtn.style.width = `${yesWidth}px`;
  yesBtn.style.height = `${yesHeight}px`;
}

/* =========================
   NO CLICK
========================= */
noBtn.addEventListener("click", () => {
  if (noBtn.textContent === "Yes") {
    yesBtn.click();
    return;
  }

  noClickCount++;

  /* =========================
     📱 MOBILE LOGIC
  ========================= */
  if (!isDesktop) {
    // MOVE PHASE
    if (mobileMoveCount < MAX_MOBILE_MOVES) {
      const moveX = Math.random() * 320 - 160;
      const moveY = Math.random() * 220 - 110;

      posX += moveX;
      posY += moveY;

      posX = Math.max(-260, Math.min(260, posX));
      posY = Math.max(-160, Math.min(160, posY));

      noBtn.style.transition = "transform 0.45s cubic-bezier(.22,1,.36,1)";
      noBtn.style.transform = `translate(${posX}px, ${posY}px)`;

      mobileMoveCount++;

      // YES grow tetap jalan
      yesWidth += 40;
      yesHeight += 14;
      yesBtn.style.width = `${yesWidth}px`;
      yesBtn.style.height = `${yesHeight}px`;

      return; // ⛔ stop di sini (tidak ubah text)
    }

    // RESET POSITION + TEXT START
    if (mobileMoveCount === MAX_MOBILE_MOVES) {
      posX = 0;
      posY = 0;

      noBtn.style.transition = "transform 0.6s cubic-bezier(.22,1,.36,1)";
      noBtn.style.transform = "translate(0px, 0px)";

      mobileMoveCount++; // lock
    }

    // TEXT PHASE (MOBILE)
    let texts = flow === 1 ? flow1NoTexts : flow2NoTexts;
    const textIndex = noClickCount - MAX_MOBILE_MOVES - 1;

    if (textIndex < texts.length) {
      noBtn.textContent = texts[textIndex];
    } else {
      noBtn.textContent = "Yes";
    }

    yesWidth += 24;
    yesHeight += 10;
    yesBtn.style.width = `${yesWidth}px`;
    yesBtn.style.height = `${yesHeight}px`;

    return;
  }

  /* =========================
     🖥 DESKTOP LOGIC
  ========================= */

  // Reset posisi saat klik pertama
  if (noClickCount === 1) {
    posX = 0;
    posY = 0;
    noBtn.style.transition = "transform 0.6s cubic-bezier(.22,1,.36,1)";
    noBtn.style.transform = "translate(0px, 0px)";
  }

  // TEXT LANGSUNG
  let texts = flow === 1 ? flow1NoTexts : flow2NoTexts;
  const textIndex = noClickCount - 1;

  if (textIndex < texts.length) {
    noBtn.textContent = texts[textIndex];
  } else {
    noBtn.textContent = "Yes";
  }

  // YES grow
  yesWidth += 40;
  yesHeight += 14;
  yesBtn.style.width = `${yesWidth}px`;
  yesBtn.style.height = `${yesHeight}px`;
});

/* =========================
   YES CLICK
========================= */
yesBtn.addEventListener("click", () => {
  if (flow === 1) {
    flow = 2;

    question.innerHTML = "Would you like to hang out on Valentine’s? 🌷";

    noBtn.textContent = "No";
    yesBtn.textContent = "Yes";

    video.style.display = "block";
    gif.style.display = "none";

    resetButtons();
    return;
  }

  if (flow === 2) {
    flow = 3;

    question.innerHTML =
      "I had a feeling you'd say yes 😄<br>" +
      "<span class='soft-text'>Guess my rizz isn’t that bad after all.</span>";

    video.pause();
    video.style.display = "none";

    gif.style.display = "block";

    yesBtn.style.display = "none";
    noBtn.style.display = "none";

    launchConfetti();
    sendAutoEmail();
  }
});

/* =========================
   CONFETTI
========================= */
function launchConfetti() {
  const duration = 2600;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

/* =========================
   EMAIL
========================= */
function sendAutoEmail() {
  const templateParams = {
    message: "She said YES 🌷",
  };

  emailjs.send("service_nsjms9n", "template_pnkcb4v", templateParams).then(
    function (response) {
      console.log("EMAIL SENT ✅", response.status, response.text);
    },
    function (error) {
      console.log("EMAIL FAILED ❌", error);
    },
  );
}
