// console.log("Theme script loaded ✅");

const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeSelector = document.getElementById("theme-selector");
// for rulles
const rulesBtn = document.getElementById("rules-btn");
const rulesModal = document.getElementById("rules-modal");
const closeModalBtn = document.getElementById("close-modal");

// Toggle modal on rules button click
rulesBtn.addEventListener("click", () => {
  rulesModal.classList.toggle("hidden");
});

// Also close modal on "X" button click
closeModalBtn.addEventListener("click", () => {
  rulesModal.classList.add("hidden");
});

// yaha tak tk

// 🎯 Map theme number to image path
const themeMap = {
  1: "accests/bg1.jpg",
  2: "accests/bg2.jpg",
  3: "accests/bg3.jpg",
  4: "accests/bg4.jpg",
  5: "accests/bg5.jpg",
};

// 🎯 Show/hide thumbnail panel on button click
themeToggleBtn.addEventListener("click", () => {
  themeSelector.classList.toggle("hidden");
});

// 🎯 When user clicks on a theme thumbnail
document.querySelectorAll(".theme-thumb").forEach(thumb => {
  thumb.addEventListener("click", () => {
    const themeId = thumb.getAttribute("data-theme");
    const themeUrl = themeMap[themeId];

    // Apply theme and save to localStorage
    document.body.style.backgroundImage = `url(${themeUrl})`;
    localStorage.setItem("selectedTheme", themeId);
  });
});

// 🎯 When page loads, apply saved theme OR default
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("selectedTheme");

  if (savedTheme && themeMap[savedTheme]) {
    document.body.style.backgroundImage = `url(${themeMap[savedTheme]})`;
  } else {
    // 🧱 Set default background if no saved theme
    document.body.style.backgroundImage = `url(blackjackbg.jpg)`;
  }
});
