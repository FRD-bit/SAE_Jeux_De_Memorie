import {DOMManager} from './DOMManager.js';
import {Game} from './Game.js';
import {ApiService} from './ApiService.js';
import {imageCollections} from "./ImageCollection.js";
const domManager = new DOMManager();
const game = new Game();

let vid = document.getElementById("audio");
document.querySelector('.game-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const dataForm = new FormData(event.target);
  const pseudo = dataForm.get('name');
  const difficulty = dataForm.get('difficulty')
  const theme = dataForm.get('col')
  const music = dataForm.get('mus')
  const back = dataForm.get('bac')

  try {
    // music player
    if (music==="yes"){
        vid.play()
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
    game.startGame(data.id, difficulty);
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
