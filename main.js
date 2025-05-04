const dealerCardsDiv = document.getElementById("dealer-cards");
const playerCardsDiv = document.getElementById("player-cards");
const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const messageEl = document.getElementById("message");

let deck = [];
let playerCards = [], dealerCards = [];
let gameOver = false;
let hideDealerCard = true;

document.getElementById("hit-btn").onclick = hit;
document.getElementById("stand-btn").onclick = stand;
document.getElementById("restart-btn").onclick = startGame;

function startGame() {
  deck = createDeck();
  shuffle(deck);
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  gameOver = false;
  hideDealerCard = true;
  messageEl.textContent = "";

  render();

  if (getScore(playerCards) === 21) {
    endGame("🎉 Blackjack! You win!");
  }
}

function createDeck() {
  const suits = ['♠', '♥', '♣', '♦'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = [];
  for (let s of suits) {
    for (let v of values) {
      deck.push({ value: v, suit: s });
    }
  }
  return deck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function getScore(cards) {
  let score = 0;
  let aces = 0;
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

function render() {
  playerCardsDiv.innerHTML = '';
  dealerCardsDiv.innerHTML = '';

  for (let card of playerCards) {
    playerCardsDiv.appendChild(createCardElement(card));
  }

  for (let i = 0; i < dealerCards.length; i++) {
    if (i === 1 && hideDealerCard && !gameOver) {
      dealerCardsDiv.appendChild(createBackCard());
    } else {
      dealerCardsDiv.appendChild(createCardElement(dealerCards[i]));
    }
  }

  playerScoreEl.textContent = "Score: " + getScore(playerCards);
  dealerScoreEl.textContent = "Score: " + (gameOver ? getScore(dealerCards) : "?");

  if (getScore(playerCards) > 21) {
    endGame("💥 You Busted! Dealer wins.");
  }
}

function createCardElement(card) {
  const div = document.createElement("div");
  div.className = "card";

  const span1=document.createElement("span");
  span1.className="span1";

  const span2=document.createElement("span");
  span2.className="span2";

  const span3=document.createElement("span");
  span3.className="span3";

  span1.textContent = card.value ;
  span2.textContent= card.suit;
  span3.textContent = card.value ;


  div.appendChild(span1);
  div.appendChild(span2);
  div.appendChild(span3);

  if(card.suit==='♥' || card.suit==='♦' ){
    div.style.color='red';
  }
  return div;
}

function createBackCard() {
  const div = document.createElement("div");
  const img=document.createElement("img")
  img.src="accests/deck1.jpg"
  div.className = "card back";
  return div;
}

function hit() {
  if (gameOver) return;
  playerCards.push(drawCard());
  render();
}

function stand() {
  if (gameOver) return;
  hideDealerCard = false;
  while (getScore(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }

  let playerScore = getScore(playerCards);
  let dealerScore = getScore(dealerCards);

  if (dealerScore > 21) {
    endGame("🎉 Dealer busted! You win!");
  } else if (playerScore > dealerScore) {
    endGame("🎉 You win!");
  } else if (playerScore < dealerScore) {
    endGame("😞 Dealer wins!");
  } else {
    endGame("🤝 It's a tie!");
  }
}

function endGame(msg) {
  gameOver = true;
  hideDealerCard = false;
  messageEl.textContent = msg;
  render();
}

startGame();
