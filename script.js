let database = {};

async function loadData() {
  try {
    const response = await fetch("database.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    database = await response.json();
  } catch (error) {
    console.error(error);
  }
}

loadData();

let totalPlayers = 0;
let players = [];
let impostorIndex = -1;
let wordCitizen = "";
let currentPlayerIndex = 0;

function switchScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function setPlayerCount(num) {
  totalPlayers = num;
  const nameContainer = document.getElementById("nameInputs");
  nameContainer.innerHTML = "";

  for (let i = 0; i < num; i++) {
    let placeholder = `Player ${i + 1}`;
    nameContainer.innerHTML += `<input type="text" id="pname_${i}" placeholder="${placeholder}">`;
  }
  switchScreen("screen-names");
}

function startLoading() {
  players = [];
  for (let i = 0; i < totalPlayers; i++) {
    let val = document.getElementById(`pname_${i}`).value.trim();
    if (val === "") val = document.getElementById(`pname_${i}`).placeholder;
    players.push(val);
  }

  switchScreen("screen-loading");

  let fill = document.getElementById("loadingFill");
  let width = 0;
  let interval = setInterval(() => {
    width += 5;
    fill.style.width = width + "%";
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => switchScreen("screen-category"), 500);
    }
  }, 100);
}

function selectCategory(category) {
  if (Object.keys(database).length === 0) {
    alert("Data belum siap.");
    return;
  }

  impostorIndex = Math.floor(Math.random() * players.length);

  let kataArray = database[category];
  let randomKataIndex = Math.floor(Math.random() * kataArray.length);
  wordCitizen = kataArray[randomKataIndex];

  currentPlayerIndex = 0;
  prepareSwipeScreen();
  switchScreen("screen-swipe");
}

function prepareSwipeScreen() {
  document.getElementById("currentPlayerLabel").innerText =
    `👤 ${players[currentPlayerIndex]}`;

  let card = document.getElementById("swipeCard");
  card.style.transform = `translateY(0px)`;
  card.style.transition = "none";
  document.getElementById("btnNextPlayer").style.display = "none";

  let revealBox = document.getElementById("revealContent");
  if (currentPlayerIndex === impostorIndex) {
    revealBox.innerHTML = `<div class="reveal-impostor">You are the<br>Impostor !!!</div>`;
  } else {
    revealBox.innerHTML = `<div class="reveal-text">Secret Word:</div><div class="reveal-word">${wordCitizen}</div>`;
  }
}

function nextPlayerTurn() {
  currentPlayerIndex++;
  if (currentPlayerIndex < players.length) {
    prepareSwipeScreen();
  } else {
    switchScreen("screen-discussion");
  }
}

const swipeCard = document.getElementById("swipeCard");
let startY = 0;
let currentY = 0;
let isDragging = false;

function dragStart(e) {
  isDragging = true;
  startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
  swipeCard.style.transition = "none";
}

function dragMove(e) {
  if (!isDragging) return;
  let y = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
  currentY = y - startY;

  if (currentY < 0) {
    swipeCard.style.transform = `translateY(${currentY}px)`;
  }
}

function dragEnd() {
  isDragging = false;
  swipeCard.style.transition = "transform 0.3s ease-out";

  if (currentY < -100) {
    swipeCard.style.transform = `translateY(-120%)`;
    document.getElementById("btnNextPlayer").style.display = "block";
  } else {
    swipeCard.style.transform = `translateY(0px)`;
  }
  currentY = 0;
}

swipeCard.addEventListener("touchstart", dragStart);
swipeCard.addEventListener("touchmove", dragMove);
swipeCard.addEventListener("touchend", dragEnd);

swipeCard.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", dragMove);
document.addEventListener("mouseup", dragEnd);
