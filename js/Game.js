import {imageCollections} from './ImageCollection.js';
import {ApiService} from './ApiService.js';


export class Game {
  /**
   * @type {number} id identifiant de la partie en cours
   */
  #id;
  #tempsRestant = null;
  #timerId;
  #rem = 0;

  async endGame() {
    const idARemplacer = this.#id;
    const nombreDePairesRestanteARemplacer = this.#rem;

    try {
      const result = await ApiService.updateGameResult(idARemplacer, nombreDePairesRestanteARemplacer);
      console.log('Fin de partie:', result);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Erreur lors de la fin de la partie');
    }

  }

  /**
   * Start a new game.
   * @param {number} id - The game ID.
   * @param {number} diff - current difficulty
   */
  startGame(id, diff) {
    // init the variable
    this.#id = id;
    this.lancerTimer(60);
    let KYS = 0;
    let SYBAU = 0;
    let C1;
    let C2;
    this.#rem = diff;
    const cards = document.querySelectorAll('.card');
    // loop for the game (and the reason i need to reload the game at the end)
      for (const card of cards) {
        card.addEventListener("click", () => {
          // retrieve the selected card id and its html position
          if (KYS !== 0 && SYBAU === 0) {
            C2 = card;
            SYBAU = card.firstElementChild.getAttribute('data-id');
          }
          if (KYS === 0) {
            C1 = card;
            KYS = card.firstElementChild.getAttribute('data-id');
          }
          // stop the game if you run out of time
          if (this.#tempsRestant <= 0) {
            this.endGame();
            alert("GAME END");
            setTimeout(AA, 1000);

            function AA() {
              location.reload();
            }
            return
          }
          card.classList.add('flip');
          // check if the pair have the same id
          if (KYS === SYBAU) {
            KYS = 0;
            SYBAU = 0;
            this.#rem -= 1;
            // end the game if every pair have been found
            if (this.#rem === 0) {
              this.endGame();
              alert("YOU WIN");
              setTimeout(AAA, 1000);

              function AAA() {
                location.reload();
              }
              return
            }
          } else if (SYBAU !== 0) {
            setTimeout(EE, 1000);

            function EE() {
              C1.classList.remove('flip');
              C2.classList.remove('flip');
              KYS = 0;
              SYBAU = 0;
            }
          }

        })
      }

}
  // read the title of the function pls
  lancerTimer(depart) {
    this.#tempsRestant = depart;
    const affichage = document.querySelector('.game-timer');


    clearInterval(this.#timerId);

    this.#timerId = setInterval(() => {
      this.#tempsRestant -= 1;
      affichage.textContent = this.#tempsRestant;

      if (this.#tempsRestant <= 0) this.stopTimer();
    }, 1000);
  }
  // i'm not gonna make the same joke 3 time in a row
  stopTimer(){
    clearInterval(this.#timerId);
  }
}
