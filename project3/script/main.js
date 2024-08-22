const cardClickSound = new Howl({
  src: ['./audio/ding.mp3'], // Adjust the path accordingly
  volume: 0.2,
});

class Card {
  static boardCards = [];
  static aboveCards = [];

  constructor(element, pattern, isAboveCard = false) {
    this.element = element;
    this.pattern = pattern;
    this.flipped = isAboveCard ? true : false; // Above cards are always flipped
    this.isAboveCard = isAboveCard;

    // Attach click event listener to the card
    this.element.addEventListener("click", () => this.cardClicked());

    // Add the created card to the respective array
    if (isAboveCard) {
      Card.aboveCards.push(this);
    } else {
      Card.boardCards.push(this);
    }
  }

  cardClicked() {
    if (!this.flipped && !this.isAboveCard) {
      this.element.classList.add("card-flipped");
      this.flipped = true;

      cardClickSound.play();
      // Call the function to check for matching patterns or perform other actions
      matchBoardAndAboveCards(this);
    }
  }

  resetCard() {
    this.element.classList.remove("card-flipped", "card-dance");
    this.flipped = this.isAboveCard ? true : false; // Above cards should always be flipped
  }

  danceAndFlip() {
    this.element.classList.add("card-dance");
    setTimeout(() => {
      this.resetCard();
      danceAndFlipCards();
    }, 50);
  }
}

function playBackgroundMusic() {
  const backgroundMusic = new Howl({
    src: ['./audio/BGM.wav'],
    loop: true,
    volume: 0.5,
  });

  // Define a named function for playing background music
  function playBGMOnClick() {
    backgroundMusic.play();
    // Remove the event listener to avoid multiple plays
    document.removeEventListener('click', playBGMOnClick);
  }

  // Add an event listener to start playing the background music on document click
  document.addEventListener('click', playBGMOnClick);

  // Display a message to the console to inform the user to click for audio
  // console.log('Click anywhere on the document to start background music.');
}

const numBoardCards = 10;
const numAboveCards = 2;

const deck = [
  "cardR01C01",
  "cardR01C02",
  "cardR01C03",
  "cardR01C04",
  "cardR01C05",
  "cardR01C06",
  "cardR01C07",
  "cardR01C08",
  "cardR01C09",
  "cardR01C10",
];

function createAboveCard() {
  const card = document.createElement("div");
  card.classList.add("card", "card-flipped"); // Add "card-flipped" class by default

  // Front face
  const frontFace = document.createElement("div");
  frontFace.classList.add("face", "front");
  card.appendChild(frontFace);

  // Back face
  const backFace = document.createElement("div");
  backFace.classList.add("face", "back");

  // Get a unique pattern for above cards
  const uniquePattern = getUniqueAboveCardPattern();
  backFace.classList.add(uniquePattern);

  card.appendChild(backFace);

  // Embed the pattern data into the DOM element
  card.setAttribute("data-pattern", "above-" + uniquePattern);

  // Append the above card to the container
  document.querySelector("#above-cards").appendChild(card);

  return card;
}

function getUniqueAboveCardPattern() {
  let uniquePattern;

  // Ensure the pattern is unique among above cards
  do {
    uniquePattern = deck[Math.floor(Math.random() * deck.length)];
  } while (Card.aboveCards.some((card) => card.pattern === uniquePattern));

  return uniquePattern;
}

function createCard(pattern, isAboveCard = false) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Front face
  const frontFace = document.createElement("div");
  frontFace.classList.add("face", "front");
  card.appendChild(frontFace);

  // Back face
  const backFace = document.createElement("div");
  backFace.classList.add("face", "back");
  backFace.classList.add(pattern); // Apply the pattern as a class to the back face
  card.appendChild(backFace);

  // Embed the pattern data into the DOM element
  card.setAttribute("data-pattern", isAboveCard ? "above-" + pattern : pattern);

  // Append the card to the appropriate container
  const containerId = isAboveCard ? "#above-cards" : "#cards";
  document.querySelector(containerId).appendChild(card);

  return card;
}

function initBoard() {
  // Shuffle the deck for both board and above cards
  const shuffledDeck = deck.slice().sort(() => 0.5 - Math.random());

  // Clear any existing cards from the arrays
  Card.boardCards.length = 0;
  Card.aboveCards.length = 0;

  // Create Card objects for each card element for both board and above cards
  for (let i = 0; i < numBoardCards; i++) {
    const pattern = shuffledDeck[i];
    const cardElement = createCard(pattern);
    const card = new Card(cardElement, pattern);
    // console.log(card);
  }

  for (let i = numBoardCards; i < numBoardCards + numAboveCards; i++) {
    const aboveCardElement = createAboveCard();
    const aboveCard = new Card(aboveCardElement, aboveCardElement.dataset.pattern, true);
    // console.log(aboveCard);
  }
}

function matchBoardAndAboveCards(boardCard) {
  const matchingAboveCard = Card.aboveCards.find(
    (aboveCard) =>
      aboveCard.element.getAttribute("data-pattern") === boardCard.element.getAttribute("data-pattern") &&
      !aboveCard.flipped
  );

  if (matchingAboveCard) {
    // Player made a correct match
    increaseScore();
    matchBoardAndAboveCards(matchingAboveCard, boardCard); // Call the updated function with both cards

    // Remove the matched above card
    const index = Card.aboveCards.indexOf(matchingAboveCard);
    Card.aboveCards.splice(index, 1);

    // Create a new above card with a new pattern
    const aboveCardElement = createAboveCard();
    const newAboveCard = new Card(aboveCardElement, getUniqueAboveCardPattern(), true);
    // console.log(newAboveCard);

    // Flip the board card back over
    setTimeout(() => {
      boardCard.resetCard();
    }, 1000); // Adjust the delay (in milliseconds) as needed
  } else {
    // Player made an incorrect match
    // Handle any logic for incorrect matches

    // Flip the wrong board card back over after a delay
    setTimeout(() => {
      boardCard.resetCard();
    }, 1000); // Adjust the delay (in milliseconds) as needed
  }
}

function increaseScore() {
  // Implement logic to increase the player's score
  // You can update the DOM or perform other actions as needed.
}

function danceAndFlipCards() {
  Card.boardCards.forEach((card) => {
    if (card.flipped) {
      card.danceAndFlip();
    }
  });
}

function checkMatchingPatterns() {
  // Get all flipped board cards
  const flippedBoardCards = Card.boardCards.filter((boardCard) => boardCard.flipped);

  // Iterate through flipped board cards
  flippedBoardCards.forEach((boardCard) => {
    // Check if there's a matching above card
    const matchingAboveCard = Card.aboveCards.find(
      (aboveCard) =>
        aboveCard.element.getAttribute("data-pattern") === boardCard.element.getAttribute("data-pattern") &&
        !aboveCard.flipped
    );

    if (matchingAboveCard) {
      // Perform actions for a match
      handleMatch(boardCard, matchingAboveCard);
    }
  });
}

function handleMatch(boardCard, aboveCard) {
  // Player made a correct match
  increaseScore();

  // Remove the matched above card
  const index = Card.aboveCards.indexOf(aboveCard);
  Card.aboveCards.splice(index, 1);

  // Create a new above card with a new pattern
  const aboveCardElement = createAboveCard();
  const newAboveCard = new Card(aboveCardElement, getUniqueAboveCardPattern(), true);
  // console.log(newAboveCard);

  // Flip the board card back over
  setTimeout(() => {
    boardCard.resetCard();
  }, 1000); // Adjust the delay (in milliseconds) as needed
}

function windowLoadHandler() {
  initBoard();
  playBackgroundMusic();

  // Example: Call the function to check for matching patterns after a set interval
  setInterval(checkMatchingPatterns, 1000);
}

window.onload = windowLoadHandler;
