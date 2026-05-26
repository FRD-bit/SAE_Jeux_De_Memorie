import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';
import {imageCollections} from "./ImageCollection.js";
const domManager = new DOMManager();
const game = new Game();

let vid = document.getElementById("audio");

// Leaderboard implementation
function updateLeaderboardUI() {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
  const scores = JSON.parse(localStorage.getItem('memory_scores') || '[]');
  if (scores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Aucune partie enregistrée</td></tr>';
    return;
  }
  tbody.innerHTML = scores.map((score, index) => `
    <tr class="${score.status === 'Gagné' ? 'row-win' : 'row-fail'}">
      <td>${index + 1}</td>
      <td>${score.player}</td>
      <td>${score.difficulty} paires</td>
      <td>${score.mode}</td>
      <td>${score.time}s</td>
      <td>${score.status}</td>
    </tr>
  `).join('');
}

// Listen for reset events to refresh scores
window.addEventListener('gameReset', updateLeaderboardUI);
updateLeaderboardUI();

// Handle abandon button click
document.getElementById('abandon').addEventListener('click', () => {
  if(vid.muted === false){vid.muted = true;}
  game.abandonGame();
});

// Handle mute button click
document.getElementById('mute-btn').addEventListener('click', () => {
  vid.muted = !vid.muted;
  document.getElementById('mute-btn').textContent = vid.muted ? "🔇" : "🔊";
  if (!vid.muted && vid.paused) {
    vid.play().catch(e => console.log("Audio play on unmute blocked:", e));
  }
});

document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const dataForm = new FormData(event.target);
  const pseudo = dataForm.get('name');
  const difficulty = dataForm.get('difficulty')
  const theme = dataForm.get('col')
  const music = dataForm.get('mus')
  const back = dataForm.get('bac')
  const mode = dataForm.get('mode')
  const flash = dataForm.get('flash') === 'yes'
  console.log("Form submit values:", { pseudo, difficulty, theme, music, back, mode, flash });

  try {
    // music player
    if (music==="yes"){
      vid.play().catch(e => console.log("Audio playback blocked:", e));
      vid.currentTime = 0;
      vid.muted = false;
        if(document.getElementById("mute-btn").hasAttribute("class")===true){document.getElementById("mute-btn").removeAttribute("class");}
    }
    else{
      document.getElementById("mute-btn").classList.add("hidden");
    }
    // custom background setting
    if (back ==="yes"){
      document.querySelector('body').setAttribute("style", "display: flex;\n" +
          "  flex-direction: column;\n" +
          "  align-items: center;\n" +
          "  justify-content: flex-start;\n" +
          "  min-height: 100vh;\n" +
          "  background-image: url(assets/images/back.png);\n" +
          "  background-repeat: no-repeat;\n" +
          "  background-size: cover;\n" +
          "  padding: 1rem;\n" +
          "  font-family: sans-serif;");
      document.querySelector('header h1').setAttribute("style", "font-size: 2.25rem;\n" +
          "  font-weight: 700;\n" +
          "  color: black;\n" +
          "  text-align: center;" +
          "  font-family: Audiowide, sans-serif;\n")
    }
    const data = await ApiService.createGame(pseudo, difficulty);
    console.log('Success:', data, data.id);
    domManager.displayGameArea();
    domManager.createCards(imageCollections[theme],imageCollections[theme], difficulty)
    game.startGame(data.id, difficulty, mode, flash);
    
    // also, custom background setting
    if (back==="yes"){
      document.querySelector('.game-timer').setAttribute("style", "  font-size: 1.125rem;\n" +
          "  font-family: Audiowide;\n" +
          "  color: black;");
      const ba = document.querySelectorAll(".card-front img");
      ba.forEach(b=>{b.setAttribute("src", `assets/images/ba.png`)})
    }

  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Erreur lors de la création de la partie');
  }
});
