window.onload = function () {
    const dealerCardsDiv = document.getElementById("dealer-cards");
    const playerCardsDiv = document.getElementById("player-cards");
    const dealerScoreEl = document.getElementById("dealer-score");
    const playerScoreEl = document.getElementById("player-score");
    const messageEl = document.getElementById("message");
    const modal = document.getElementById("modal");
    const restartBtn = document.getElementById("restart-btn");
    const modalhead = document.querySelector(".heading-modal");
  
    let deck = [];
    let playerCards = [], dealerCards = [];
    let gameOver = false;
    let hideDealerCard = true;
    let hiddenDealerCardContainer = null;
  
  
    // Show modal on load
    modal.style.display = "flex";
  
    // Restart button
    restartBtn.onclick = () => {
      modal.style.display = "none";
      restartBtn.textContent = "Restart";
      modalhead.style.display = "none";
        // hide win massage
    messageEl.style.display="none";
      startGame();
    };
  
    document.getElementById("hit-btn").onclick = () => {
      if (gameOver) return;
      const card = drawCard();
      playerCards.push(card);
      dealAnimatedCard(card, playerCardsDiv, true);
      setTimeout(updateScores, 800);
    };
  
    document.getElementById("stand-btn").onclick = () => {
      if (gameOver) return;
      hideDealerCard = false;
      revealDealerHiddenCard();
    };
  
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
  
      setTimeout(updateScores, 1100);
    }
  
    function updateScores() {
      const pScore = getScore(playerCards);
      playerScoreEl.textContent = "Score: " + pScore;
      if (pScore > 21) {
        endGame("💥 You Busted! Dealer wins." ,1);
      }
    }
  
    function revealDealerHiddenCard() {
      if (hiddenDealerCardContainer) {
        hiddenDealerCardContainer.classList.add("flipped");
      }
  
      setTimeout(() => {
        while (getScore(dealerCards) < 17) {
          const card = drawCard();
          dealerCards.push(card);
          dealAnimatedCard(card, dealerCardsDiv, true);
        }
  
        const dScore = getScore(dealerCards);
        const pScore = getScore(playerCards);
        dealerScoreEl.textContent = "Score: " + dScore;
  
        if (dScore > 21) endGame("🎉 Dealer busted! You win!",2);
        else if (pScore > dScore) endGame("🎉 You win!",2);
        else if (pScore < dScore) endGame("😞 Dealer wins!",1);
        else endGame("🤝 It's a tie!",3);
      }, 1000);
    }
  
    function endGame(msg,number) {
      gameOver = true;
      forMassage(msg,number)
      messageEl.style.display="block"
      setTimeout(() => {
        modal.style.display = "flex";
      }, 300);
    }
  
    function drawCard() {
      return deck.pop();
    }
  
    function createDeck() {
      const suits = ['♠', '♥', '♣', '♦'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const d = [];
      for (let s of suits) for (let v of values) d.push({ value: v, suit: s });
      return d;
    }
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
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
      const audio = new Audio('sound_effect/card.mp3'); // Use your audio file
      audio.play();
      setTimeout(() => {
        if (faceUp) container.classList.add("flipped");
      }, 300);
      
      return container;
    }
    function forMassage(msg,number){
        messageEl.textContent=msg;
        if(number===1){
            messageEl.style.backgroundColor='red';
        }
        else if(number===2){
            messageEl.style.backgroundColor='green';
            const audio = new Audio('sound_effect/win.mp3');
           audio.play();

         setTimeout(() => {
              audio.pause();
               audio.currentTime = 0;
            }, 3550);
         
        }else{messageEl.style.backgroundColor='yello';}
    }
  };
  