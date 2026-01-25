import Phaser from 'phaser';
import Preloader from './src/scenes/Preloader';
import PlayScene from './src/scenes/PlayScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#5c94fc', // Classic Mario sky blue
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true // Enable debug for development
    }
  },
  scene: [Preloader, PlayScene]
};

const game = new Phaser.Game(config);

// UI Logic
const uiLayer = document.getElementById('ui-layer');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');

// Close Modal Logic
closeModal.addEventListener('click', () => {
    uiLayer.classList.add('hidden');
    game.scene.resume('PlayScene'); // Resume game
});

// Open Modal Logic
window.addEventListener('open-modal', (event) => {
    const type = event.detail.type;
    console.log('Open Modal:', type);
    
    // Pause Game
    game.scene.pause('PlayScene');

    // Set Content
    let content = '';
    switch(type) {
        case 'about':
            content = `
                <h2>About Me</h2>
                <p>Hi! I'm a passionate developer building interactive experiences.</p>
                <p>Welcome to my pixel art portfolio.</p>
            `;
            break;
        case 'skills':
            content = `
                <h2>Skills</h2>
                <p>JavaScript, Phaser, React, Node.js</p>
                <ul>
                    <li>Web Development</li>
                    <li>Game Design</li>
                    <li>Backend Systems</li>
                </ul>
            `;
            break;
        case 'projects':
            content = `
                <h2>Projects</h2>
                <p>Check out my latest work:</p>
                <div class="project-card">
                    <h3>Project Alpha</h3>
                    <p>A cool React app.</p>
                </div>
            `;
            break;
        default:
            content = `<p>Unknown section...</p>`;
    }

    modalContent.innerHTML = content;
    uiLayer.classList.remove('hidden');
});
