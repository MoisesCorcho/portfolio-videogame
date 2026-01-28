import Phaser from 'phaser';
import Preloader from './src/scenes/Preloader';
import PlayScene from './src/scenes/PlayScene';
import { ResumeData } from './src/data/ResumeData';

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#5c94fc', // Classic Mario sky blue
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE, // Switch to RESIZE as per previous intent for full screen
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
    
    if (type === 'profile' || type === 'about') {
        const p = ResumeData.profile;
        content = `
            <div class="resume-section">
                <h2>${p.name}</h2>
                <h3 class="text-xl text-gray-300">${p.title}</h3>
                <p class="italic text-gray-400">${p.location}</p>
                <div class="my-4 p-4 bg-gray-800 rounded">
                    <p>${p.summary}</p>
                </div>
                <div class="text-sm">
                    <p>📧 ${p.contact.email}</p>
                    <p>📱 ${p.contact.phone}</p>
                    <p>🔗 <a href="https://${p.contact.linkedin}" target="_blank" class="text-blue-400">LinkedIn</a></p>
                    <p>🌐 <a href="https://${p.contact.portfolio}" target="_blank" class="text-blue-400">Portfolio</a></p>
                </div>
            </div>
        `;
    } else if (type === 'experience') {
        content = `<h2>Experience</h2><div class="space-y-4">`;
        ResumeData.experience.forEach(exp => {
            content += `
                <div class="p-4 bg-gray-800 rounded border border-gray-700">
                    <h3 class="text-lg font-bold text-yellow-400">${exp.role}</h3>
                    <div class="flex justify-between text-sm text-gray-400 mb-2">
                        <span>${exp.company}</span>
                        <span>${exp.date}</span>
                    </div>
                    <p class="text-sm mb-2">${exp.description}</p>
                    <div class="flex flex-wrap gap-2">
                        ${exp.stack.map(s => `<span class="px-2 py-1 bg-blue-900 rounded text-xs">${s}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        content += `</div>`;
    } else if (type === 'skills') {
        const s = ResumeData.skills;
        content = `
            <h2>Skills</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-800 p-3 rounded">
                    <h3 class="text-yellow-400 font-bold">Languages</h3>
                    <p class="text-sm">${s.languages.join(', ')}</p>
                </div>
                <div class="bg-gray-800 p-3 rounded">
                    <h3 class="text-yellow-400 font-bold">Frameworks</h3>
                    <p class="text-sm">${s.frameworks.join(', ')}</p>
                </div>
                <div class="bg-gray-800 p-3 rounded">
                    <h3 class="text-yellow-400 font-bold">Tools</h3>
                    <p class="text-sm">${s.tools.join(', ')}</p>
                </div>
                <div class="bg-gray-800 p-3 rounded">
                    <h3 class="text-yellow-400 font-bold">Concepts</h3>
                    <p class="text-sm">${s.concepts.join(', ')}</p>
                </div>
            </div>
        `;
    } else if (type === 'education') {
        content = `<h2>Education & Certifications</h2><div class="space-y-4">`;
        ResumeData.education.forEach(edu => {
             content += `
                <div class="p-3 bg-gray-800 rounded border-l-4 border-green-500">
                    <h3 class="font-bold">${edu.degree}</h3>
                    <p class="text-sm text-gray-300">${edu.school}</p>
                    <p class="text-xs text-gray-500">${edu.date}</p>
                </div>
             `;
        });
        content += `<h3 class="mt-4 text-yellow-400">Certifications</h3><ul class="list-disc pl-5 text-sm">`;
        ResumeData.certs.forEach(cert => {
            content += `<li>${cert}</li>`;
        });
        content += `</ul></div>`;
    } else {
        content = `<p>Unknown section type: ${type}</p>`;
    }

    modalContent.innerHTML = content;
    uiLayer.classList.remove('hidden');
});
