const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.spritesheet('backs', './images/food.jpg', { frameWidth: 63, frameHeight: 67 });
  this.load.image('front', './images/back.jpg');
}

function create() {
  const displayCards = [
      { front: 'front', back: 'backs', backIndex: 0 },
      { front: 'front', back: 'backs', backIndex: 1 },
      { front: 'front', back: 'backs', backIndex: 2 },
      { front: 'front', back: 'backs', backIndex: 3 },
      { front: 'front', back: 'backs', backIndex: 4 },
      { front: 'front', back: 'backs', backIndex: 5 },
      { front: 'front', back: 'backs', backIndex: 6 },
      { front: 'front', back: 'backs', backIndex: 7 },
      { front: 'front', back: 'backs', backIndex: 8 },
      { front: 'front', back: 'backs', backIndex: 9 }
  ];

  const cards = this.add.group();
  const displayedCards = [];
  const scene = this;

  for (let i = 0; i < 2; i++) {
      const randomBackIndex = Phaser.Math.Between(0, 9);
      const topCard = cards.create(i * 100, 0, 'front').setInteractive();
      topCard.backImage = cards.create(i * 100, 0, 'backs', randomBackIndex).setAlpha(1);
      topCard.isFlipped = true;
      displayedCards.push(randomBackIndex);
  }

  displayCards.forEach((cardInfo, index) => {
      const card = cards.create((index % 5) * 100, Math.floor(index / 5) * 200 + 100, cardInfo.front).setInteractive();
      card.backImage = cards.create((index % 5) * 100, Math.floor(index / 5) * 200 + 100, cardInfo.back, cardInfo.backIndex).setAlpha(0);
      card.isFlipped = false;

      card.on('pointerup', function () {
          toggleVisibility(card);
          checkMatch(card);
      });

      this.time.delayedCall(index * 200, () => {
          card.setAlpha(1);
      });
  });

  function toggleVisibility(clickedCard) {
      if (!clickedCard.isFlipped) {
          clickedCard.setAlpha(0);
          clickedCard.backImage.setAlpha(1);
          clickedCard.isFlipped = true;
      } else {
          clickedCard.setAlpha(1);
          clickedCard.backImage.setAlpha(0);
          clickedCard.isFlipped = false;
      }
  }

  function checkMatch(clickedCard) {
      if (!displayedCards.includes(clickedCard.backImage.frame.name)) {
          scene.time.delayedCall(500, () => {
              toggleVisibility(clickedCard);
          });
      }
  }
}