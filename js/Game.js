import { ApiService } from './ApiService.js';
import { DOMManager } from './DOMManager.js';

export class Game {
    /**
     * @type {number} id identifiant de la partie en cours
     */
    #id;
    #tempsRestant = null;
    #tempsEcoule = 0;
    #timerId;
    #rem = 0;
    #DifficulteInitiale = 0;
    #mode = 'chrono';

    async endGame(status = 'victoire') {
        try {
            const result = await ApiService.updateGameResult(this.#id, this.#rem);
            console.log('Fin de partie API:', result);
        } catch (error) {
            console.error('Error API:', error);
        }

        // Sauvegarder dans le Leaderboard local
        this.saveToLeaderboard(status);
    }

    saveToLeaderboard(status) {
        const pseudo = document.getElementById('name').value || 'Joueur';
        const timeTaken = this.#mode === 'chrono' ? (60 - this.#tempsRestant) : this.#tempsEcoule;

        const entry = {
            player: pseudo,
            difficulty: this.#DifficulteInitiale,
            mode: this.#mode === 'chrono' ? 'Chrono' : 'Entraînement',
            time: timeTaken,
            status: status === 'victoire' ? 'Gagné' : status === 'abandon' ? 'Abandon' : 'Perdu',
            date: new Date().toLocaleDateString('fr-FR')
        };

        const scores = JSON.parse(localStorage.getItem('memory_scores') || '[]');
        scores.push(entry);

        // Trier les scores : Victoires d'abord, puis par plus grande difficulté, puis par temps le plus court
        scores.sort((a, b) => {
            if (a.status === 'Gagné' && b.status !== 'Gagné') return -1;
            if (a.status !== 'Gagné' && b.status === 'Gagné') return 1;
            if (a.status === 'Gagné' && b.status === 'Gagné') {
                if (b.difficulty !== a.difficulty) {
                    return b.difficulty - a.difficulty; // Plus de paires = meilleur
                }
                return a.time - b.time; // Temps plus court = meilleur
            }
            return 0;
        });

        localStorage.setItem('memory_scores', JSON.stringify(scores.slice(0, 10)));
    }

    /**
     * Start a new game.
     * @param {number} id - The game ID.
     * @param {number} diff - current difficulty
     * @param {string} mode - game mode ('chrono' or 'zen')
     * @param {boolean} flash - show flash preview
     */
    startGame(id, diff, mode = 'chrono', flash = false) {
        console.log("startGame started with:", { id, diff, mode, flash });
        this.#id = id;
        this.#rem = Number(diff);
        this.#DifficulteInitiale = Number(diff);
        this.#mode = mode;

        const startVal = mode === 'chrono' ? 60 : 0;
        const cards = document.querySelectorAll('.card');
        console.log("Found cards in game-board:", cards.length);

        let KYS = null;
        let SYBAU = null;
        let locked = false;

        if (flash) {
            locked = true;
            cards.forEach(c => c.classList.add('flip'));
            const affichage = document.querySelector('.game-timer');
            if (affichage) {
                affichage.textContent = "Scanner... 👀";
            }
            setTimeout(() => {
                cards.forEach(c => c.classList.remove('flip'));
                locked = false;
                this.lancerTimer(startVal, mode);
            }, 3000);
        } else {
            this.lancerTimer(startVal, mode);
        }

        for (const card of cards) {
            card.addEventListener("click", () => {
                if (locked || card.classList.contains('flip')) return;
                if (this.#mode === 'chrono' && this.#tempsRestant <= 0) {
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
                            this.endGame('victoire');
                            setTimeout(() => {
                                alert("🏆 FÉLICITATIONS, VOUS AVEZ GAGNÉ !");
                                this.resetGame();
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

    lancerTimer(depart, mode = 'chrono') {
        this.#tempsRestant = depart;
        this.#tempsEcoule = 0;
        const affichage = document.querySelector('.game-timer');
        this.stopTimer();

        if (affichage) {
            affichage.textContent = mode === 'chrono' ? `${this.#tempsRestant}s` : `${this.#tempsEcoule}s`;
        }

        this.#timerId = setInterval(() => {
            if (mode === 'chrono') {
                this.#tempsRestant -= 1;
                if (affichage) {
                    affichage.textContent = `${this.#tempsRestant}s`;
                }
                if (this.#tempsRestant <= 0) {
                    this.stopTimer();
                    this.endGame('perdu');
                    setTimeout(() => {
                        alert("⌛ TEMPS ÉCOULÉ ! Game Over.");
                        this.resetGame();
                    }, 100);
                }
            } else {
                this.#tempsEcoule += 1;
                if (affichage) {
                    affichage.textContent = `${this.#tempsEcoule}s`;
                }
            }
        }, 1000);
    }

    async abandonGame() {
        this.stopTimer();
        await this.endGame('abandon');
        alert("Partie abandonnée !");
        if(document.querySelector('body').hasAttribute("style") === true){document.querySelector('body').removeAttribute("style");}
        if(document.querySelector('header h1').hasAttribute("style")===true){document.querySelector('header h1').removeAttribute("style");}
        if(document.querySelector('.game-timer').hasAttribute("style")===true){document.querySelector('.game-timer').removeAttribute("style");}
        this.resetGame();
    }

    resetGame() {
        this.stopTimer();
        const dom = new DOMManager();
        dom.displaySetupForm();
        window.dispatchEvent(new CustomEvent('gameReset'));
    }

    stopTimer() {
        clearInterval(this.#timerId);
    }
}