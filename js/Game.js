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

    /**
     * Start a new game.
     * @param {number} id - The game ID.
     * @param {number} diff - current difficulty
     */
    startGame(id, diff) {
        this.#id = id;
        this.lancerTimer(60);
        this.#rem = diff;

        let KYS = null;
        let SYBAU = null;
        let locked = false;

        const cards = document.querySelectorAll('.card');

        for (const card of cards) {
            card.addEventListener("click", () => {
                if (locked || card.classList.contains('flip')) return;
                if (this.#tempsRestant <= 0) {
                    return;
                }
                card.classList.add('flip');
                if (!KYS) {
                    KYS = card;
                } else {
                    SYBAU = card;
                    locked = true;
                    const id1 = KYS.firstElementChild.getAttribute('data-id');
                    const id2 = SYBAU.firstElementChild.getAttribute('data-id');
                    if (id1 === id2) {
                        KYS = null;
                        SYBAU = null;
                        locked = false;
                        this.#rem -= 1;

                        if (this.#rem === 0) {
                            this.stopTimer();
                            this.endGame();
                            // end the game
                            setTimeout(() => {
                                alert("YOU WIN");
                                setTimeout(() => location.reload(), 1000);
                            }, 500);
                        }
                    } else {
                        setTimeout(() => {
                            KYS.classList.remove('flip');
                            SYBAU.classList.remove('flip');
                            KYS = null;
                            SYBAU = null;
                            locked = false;
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
                // end the game
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