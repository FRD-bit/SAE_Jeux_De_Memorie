# SAÉ S2.01 - Développement d'un Jeu de Memory

**Groupe 112**

### Membres de l'équipe :
* **Farid ELBEHIRY**
* **Adam LAHCENE**
* **Bastien DUBOIS THEVENOT**

### Description du projet
Dans le cadre de notre SAÉ, nous avons développé un jeu de Memory en JavaScript en y intégrant des fonctionnalités avancées et un système de personnalisation complet.

### Fonctionnalités & Personnalisation
Nous avons mis en place un système permettant de personnaliser facilement 5 éléments clés du jeu :

* **La musique :** Il suffit de placer le fichier audio désiré dans le dossier `sound` et de remplacer `val_loop.mp3` dans le HTML par le nom du nouveau fichier.
* **Le fond d'écran :** Il suffit de supprimer l'image `back.png` et d'ajouter le nouveau fond d'écran en le nommant `back.png` (en adaptant l'extension si nécessaire).
* **Les cartes :** Il faut ajouter les images souhaitées dans le dossier `custom`, puis aller dans `ImageCollection.js` pour remplacer le nom de l'image dans le lien existant.
* **Le dos des cartes :** Même principe que pour le fond d'écran, en renommant l'image pour qu'elle corresponde au format attendu.

### Améliorations de Gameplay
* **Tableau des scores :** Intégration d' un tableau de score local qui permet de sauvegarder et trier nos meilleurs scores.
* **Mode Flash :** Si sélectionné, ce mode permet au joueur de voir toutes les cartes révélées pendant 3 secondes avant qu'elles ne se retournent au début de la partie.
* **Contrôle Audio :** Ajout d'un bouton mute/unmute directement dans l'interface du jeu pour activer ou désactiver la musique à tout moment.
