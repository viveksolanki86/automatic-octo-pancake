  document.addEventListener("DOMContentLoaded", function () {
  window.onload = function () {
    let dealerCardsDiv ;
    let playerCardsDiv = document.getElementById("player-cards");
    let dealerScoreEl ;
    let playerScoreEl = document.getElementById("player-score");
    let messageEl = document.getElementById("message");
  
    let restartBtn = document.getElementById("restart-btn");
    let totalMoneyEl=document.getElementById("total-money"); 
    let gameMoneyEl = document.getElementById("gamemony");
    let dealBtn = document.getElementById("deal-btn");
    let coinBox = document.getElementById("coin-box");
    const coins = document.querySelectorAll(".coin");
    let game=document.getElementById("game-container");
    let totalMoney = parseInt(localStorage.getItem("totalMoney")) || 1000;
    let betAmount = 0;
    let deck = [];
    let playerCards = [], dealerCards = [];
    let gameOver = false;
    let hideDealerCard = true;
    let hiddenDealerCardContainer = null;

    // ye js
    const startScreen = document.getElementById("start-screen");
  const startButton = document.getElementById("start-button");
  const playerButtons = document.querySelectorAll(".player-btn");

  let selectedPlayers = null;

  playerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deselect all
      playerButtons.forEach(b => b.classList.remove("selected"));
      // Select current
      btn.classList.add("selected");
      // Save player count
      selectedPlayers = parseInt(btn.getAttribute("data-players"));
      // Enable Start button
      startButton.disabled = false;
    });
  });


  // if (startScreen && startButton) {
    startButton.addEventListener("click", () => {
      if (selectedPlayers !== null) {
        startScreen.style.display = "none"; // ✅ only runs if not null
        game.style.display = "block";
        setupGameLayout(selectedPlayers);
        initElements();
        // startGame();
      }
    });
  // }

  function setupGameLayout(playerCount) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear previous layout

    // 1️⃣ Dealer row
    const dealerRow = document.createElement('div');
    dealerRow.id = 'dealer-row';
    dealerRow.innerHTML = `
  <div id="dealer-cards" class="card-area">
    <div>Dealer</div>
    <div id="dealer-score">Score: ?</div>
  </div>`;

    gameContainer.appendChild(dealerRow);

    // 2️⃣ Controls row (your HTML)
    const controlRow = document.createElement('div');
    controlRow.innerHTML = `
      <div class="controls">
        <button id="hit-btn" class="btn">Hit</button>
        <div class="gamemony" id="gamemony">hii</div>
        <div class="message" id="message">hii</div>
        <button id="stand-btn" class="btn">Stand</button>
      </div>
    `;
    gameContainer.appendChild(controlRow);

    // 3️⃣ Player rows based on selected count
    const playerRows = [];

    if (playerCount === 1) {
      playerRows.push([1]);
    } else if (playerCount === 2) {
      playerRows.push([1, 2]);
    } else if (playerCount === 3) {
      playerRows.push([1, 2], [3]);
    } else if (playerCount === 4) {
      playerRows.push([1, 2], [3, 4]);
    } else if (playerCount === 5) {
      playerRows.push([1, 2], [3], [4, 5]);
    }

    playerRows.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('player-row');

      row.forEach(num => {
        const player = document.createElement('div');
        player.classList.add('card-area');
        player.id = `player-${num}-cards`;
       player.innerHTML = `<div>Player ${num}</div><div id="${num === 1 ? 'player-score' : `player-${num}-score`}">Score: 0</div>`;

        rowDiv.appendChild(player);
      });

      gameContainer.appendChild(rowDiv);
    });
  }
  function initElements() {
    dealerCardsDiv = document.getElementById("dealer-cards");
    dealerScoreEl = document.getElementById("dealer-score");
    playerCardsDiv = document.getElementById("player-1-cards"); // For player 1
    playerScoreEl = document.getElementById("player-score"); // Update if dynamic
    messageEl = document.getElementById("message"); // If still static
    document.getElementById("hit-btn").onclick = async () => {
      if (gameOver) return;
      const card = drawCard();
      playerCards.push(card);
      dealAnimatedCard(card, playerCardsDiv, true);
      await delay(800); // Wait for card animation
      updatePlayerScore();
    };

    document.getElementById("stand-btn").onclick = () => {
      if (gameOver) return;
      hideDealerCard = false;
      revealDealerHiddenCard();
    };
  }


  // yaha tak 

    updateMoneyDisplay();

    coins.forEach(coin => {
      coin.addEventListener("click", () => {
        const value = parseInt(coin.textContent.replace("$", ""));
        betAmount = value * 2;
        // gameMoneyEl.textContent = "$" + betAmount;
      });
    });

    dealBtn.addEventListener("click", () => {
      if (betAmount === 0) {
        alert("Please select a bet first!");
        return;
      }
      messageEl.style.display='none';
      coinBox.classList.add("hidden");
      totalMoney += betAmount/2;
      updateMoneyDisplay();
      setTimeout(() => {
        game.style.display='block';
        startGame();
      }, 1000);
    });

    function updateMoneyDisplay() {
      totalMoneyEl.textContent = "$" + totalMoney;
    }

    

    function startGame() {
      deck = createDeck();
      shuffle(deck);
      playerCards = [];
      dealerCards = [];
      gameOver = false;
      hideDealerCard = true;
      hiddenDealerCardContainer = null;
      messageEl.textContent = "";

      playerCardsDiv.innerHTML = '';
      dealerCardsDiv.innerHTML = '';
      dealerScoreEl.textContent = "Score: ?";
      playerScoreEl.textContent = "Score: 0";

      const p1 = drawCard(), p2 = drawCard();
      const d1 = drawCard(), d2 = drawCard();

      playerCards.push(p1, p2);
      dealerCards.push(d1, d2);

      dealAnimatedCard(p1, playerCardsDiv, true);
      setTimeout(() => dealAnimatedCard(p2, playerCardsDiv, true), 300);
      setTimeout(() => dealAnimatedCard(d1, dealerCardsDiv, true), 600);
      setTimeout(() => {
        hiddenDealerCardContainer = dealAnimatedCard(d2, dealerCardsDiv, false);
      }, 900);

      setTimeout(updatePlayerScore, 1100);
    }

    function updatePlayerScore() {
      const pScore = getScore(playerCards);
      playerScoreEl.textContent = "Score: " + pScore;

      if (pScore > 21) {
        setTimeout(() => {
          endGame("💥 You Busted! Dealer wins.", 1);
        }, 300); // Wait a bit for flip
      }
    }

    function drawCard() {
      return deck.pop();
    }

    function createDeck() {
      const suits = ['♠', '♥', '♣', '♦'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const d = [];
      for (let s of suits) {
        for (let v of values) {
          d.push({ value: v, suit: s });
        }
      }
      return d;
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function getScore(cards) {
      let score = 0, aces = 0;
      for (let card of cards) {
        if (card.value === 'A') {
          score += 11;
          aces++;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
          score += 10;
        } else {
          score += parseInt(card.value);
        }
      }
      while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
      }
      return score;
    }

    function dealAnimatedCard(card, targetDiv, faceUp = true) {
      const container = document.createElement("div");
      container.className = "container";

      const cardDiv = document.createElement("div");
      cardDiv.className = "card";

      const front = document.createElement("div");
      front.className = "front";

      const span1 = document.createElement("span");
      span1.className = "span1";
      span1.textContent = card.value;

      const span2 = document.createElement("span");
      span2.className = "span2";
      span2.textContent = card.suit;

      const span3 = document.createElement("span");
      span3.className = "span3";
      span3.textContent = card.value;

      front.appendChild(span1);
      front.appendChild(span2);
      front.appendChild(span3);

      if (card.suit === '♥' || card.suit === '♦') {
        front.style.color = 'red';
      }

      const back = document.createElement("div");
      back.className = "back";

      cardDiv.appendChild(front);
      cardDiv.appendChild(back);
      container.appendChild(cardDiv);
      targetDiv.appendChild(container);

      const audio = new Audio('sound_effect/card.mp3');
      audio.play();

      const animationDuration = 1500;
      if (faceUp) {
        setTimeout(() => {
          container.classList.add("flipped");
        }, animationDuration - 200);
      }

      return container;
    }

    async function revealDealerHiddenCard() {
      if (hiddenDealerCardContainer) {
        hiddenDealerCardContainer.classList.add("flipped");
      }

      await delay(1000);

      let dScore = getScore(dealerCards);

      while (dScore < 17) {
        const card = drawCard();
        dealerCards.push(card);
        dealAnimatedCard(card, dealerCardsDiv, true);
        await delay(800);
        dScore = getScore(dealerCards);
      }

      dealerScoreEl.textContent = "Score: " + dScore;
      await delay(500);

      const pScore = getScore(playerCards);
      if (dScore > 21) endGame("🎉 Dealer busted! You win!", 2);
      else if (pScore > dScore) endGame("🎉 You win!", 2);
      else if (pScore < dScore) endGame("😞 Dealer wins!", 1);
      else endGame("🤝 It's a tie!", 3);
    }

    function endGame(msg, number) {
      gameOver = true;
      showMessage(msg, number);
    
    
    }

    function showMessage(msg, number) {
      messageEl.textContent = msg;
      if (number === 1) {
        messageEl.style.backgroundColor = 'red';
        
      } else if (number === 2) {
        totalMoney -= betAmount;
        messageEl.style.backgroundColor = 'green';
        const audio = new Audio('sound_effect/win.mp3');
        audio.play();
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 3550);
      } else {
        messageEl.style.backgroundColor = 'yellow';
        totalMoney += betAmount/2;
      }
      localStorage.setItem("totalMoney", totalMoney);
      updateMoneyDisplay();
      
      messageEl.style.display = "block";
      const allplayerCards=document.querySelectorAll(".container")
      allplayerCards.forEach((e ,index) => {
          setTimeout(() => {
              e.classList.add("endAnimation");
          }, 400 *  index);

          })

      setTimeout(() => {
    coinBox.classList.remove("hidden");
    // game.style.display="none";
  }, 3300); // Coin box will slide back up after 3 seconds

      coinBox.classList.remove("hidden");
    }

    function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };
  });