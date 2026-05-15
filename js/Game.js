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
        try {
            const result = await ApiService.updateGameResult(this.#id, this.#rem);
            console.log('Fin de partie:', result);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Erreur lors de la fin de la partie');
        }
    }
//
    /**
     * Start a new game.
     * @param {number} id - The game ID.
     * @param {number} diff - current difficulty
     */
    startGame(id, diff) {
        this.#id = id;
        this.lancerTimer(60);
        this.#rem = diff;

        let carte1 = null;
        let carte2 = null;
        let verrouillage = false;

        const cards = document.querySelectorAll('.card');

        for (const card of cards) {
            card.addEventListener("click", () => {
                if (verrouillage || card.classList.contains('flip')) return;

                if (this.#tempsRestant <= 0) {
                    return;
                }

                card.classList.add('flip');

                if (!carte1) {
                    carte1 = card;
                } else {
                    carte2 = card;
                    verrouillage = true;

                    const id1 = carte1.firstElementChild.getAttribute('data-id');
                    const id2 = carte2.firstElementChild.getAttribute('data-id');

                    if (id1 === id2) {
                        carte1 = null;
                        carte2 = null;
                        verrouillage = false;
                        this.#rem -= 1;

                        if (this.#rem === 0) {
                            this.stopTimer();
                            this.endGame();

                            // LA CORRECTION EST ICI : On attend 500ms avant d'afficher l'alerte
                            setTimeout(() => {
                                alert("YOU WIN");
                                setTimeout(() => location.reload(), 1000);
                            }, 500);
                        }
                    } else {
                        setTimeout(() => {
                            carte1.classList.remove('flip');
                            carte2.classList.remove('flip');
                            carte1 = null;
                            carte2 = null;
                            verrouillage = false;
                        }, 1000);
                    }
                }
            });
        }
    }
// read the title of the function pls
    lancerTimer(depart) {
        this.#tempsRestant = depart;
        const affichage = document.querySelector('.game-timer');

        this.stopTimer();

        this.#timerId = setInterval(() => {
            this.#tempsRestant -= 1;

            if(affichage) {
                affichage.textContent = this.#tempsRestant;
            }

            if (this.#tempsRestant <= 0) {
                this.stopTimer();
                this.endGame();

                // On met aussi un petit délai ici par précaution
                setTimeout(() => {
                    alert("GAME END");
                    setTimeout(() => location.reload(), 1000);
                }, 100);
            }
        }, 1000);
    }
    // i'm not gonna make the same joke 3 time in a row
    stopTimer() {
        clearInterval(this.#timerId);
    }
}