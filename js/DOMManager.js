export class DOMManager {
  /**
   * Ajoute toutes les images d'une collection sur le gameBoard
   * @param {Image[]} images1
   * @param {Image[]} images2
   * @param {number} diff
   */
  createCards(images1, images2, diff) {
    const gameBoard = document.querySelector('.game-board');

    // Reset columns classes and inner HTML
    gameBoard.className = 'game-board';
    if (Number(diff) === 5) {
      gameBoard.classList.add('cols-5');
    }
    gameBoard.innerHTML = '';

    // change the amount of pair used
    let am = Number(diff);
    const n1 = images1.slice(0, am);
    const n2 = images2.slice(0, am);
    n2.forEach(add => {
      n1.push(add);
    });

    // shuffle the cards
    n1.sort(function () { return 0.5 - Math.random() });
    // create the cards on the game-board
    n1.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-inner" data-id="${image.id}">
          <div class="card-front">
            <img src="../assets/images/mask1.jpg" alt="Hidden card">
          </div>
          <div class="card-back">
            <img src="${image.url}" alt="${image.name}">
          </div>
        </div>
      `;
      gameBoard.appendChild(card);
    });
  }
  // read the title of the function pls
  displayGameArea() {
    document.querySelector('.setup-form').classList.add('hidden');
    document.querySelector('.leaderboard-section').classList.add('hidden');
    document.querySelector('.game-area').classList.remove('hidden');
  }
  // fully used now to go back cleanly without reloading
  displaySetupForm() {
    document.querySelector('.game-area').classList.add('hidden');
    document.querySelector('.setup-form').classList.remove('hidden');
    document.querySelector('.leaderboard-section').classList.remove('hidden');
  }
}
