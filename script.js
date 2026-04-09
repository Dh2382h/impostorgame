// 1. Mengubah Database menjadi Array of Objects (Opsi 2)
const database = {
  Place: [
    { id: 1, name: "Pantai" },
    { id: 2, name: "Gunung" },
    { id: 3, name: "Sekolah" },
    { id: 4, name: "Rumah Sakit" },
    { id: 5, name: "Mall" },
    { id: 6, name: "Pasar" },
  ],
  "Public Figure": [
    { id: 1, name: "Joko Widodo" },
    { id: 2, name: "Agnez Mo" },
    { id: 3, name: "Reza Rahadian" },
    { id: 4, name: "Raditya Dika" },
    { id: 5, name: "Pratama Arhan" },
    { id: 6, name: "Jess No Limit" },
  ],
  Stuff: [
    { id: 1, name: "Mobil" },
    { id: 2, name: "Motor" },
    { id: 3, name: "Laptop" },
    { id: 4, name: "Smartphone" },
    { id: 5, name: "Meja" },
    { id: 6, name: "Kursi" },
  ],
  Animals: [
    { id: 1, name: "Kucing" },
    { id: 2, name: "Anjing" },
    { id: 3, name: "Singa" },
    { id: 4, name: "Harimau" },
    { id: 5, name: "Burung" },
    { id: 6, name: "Ikan" },
  ],
};

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

// 2. Menyesuaikan cara mengambil data dari format baru
function selectCategory(category) {
  impostorIndex = Math.floor(Math.random() * players.length);

  let kataArray = database[category];
  let randomKataIndex = Math.floor(Math.random() * kataArray.length);

  // PERUBAHAN PENTING:
  // Karena sekarang bentuknya objek { id: 1, name: "Pantai" },
  // kita harus memanggil properti .name untuk mendapatkan kata "Pantai"-nya.
  wordCitizen = kataArray[randomKataIndex].name;

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
