# Portfolio Level Design Concept

## Theme: Legacy Fantasy
The game is set in a pixel-art fantasy world ("Legacy Fantasy"), where the player explores the hero's journey (the developer's career).

## Zones & Layout
The level is a horizontal side-scroller (5000px width).

### 1. The Starting Clearing (Profile)
*   **Concept**: A peaceful cabin in the woods where the hero lives.
*   **Resume Section**: `Profile`
*   **Interactables**:
    *   **Mailbox / Sign**: Displays rudimentary info (Name, Title).
    *   **The Cabin (Door)**: "Enter" the cabin to see the full "About Me" modal.
*   **Assets Needed**:
    *   `cabin.png` (or use existing `shop.png` or `large_tent.png` as placeholder)
    *   `mailbox.png`

### 2. The Training Grounds (Skills)
*   **Concept**: An area with training dummies, archery targets, and weapon racks.
*   **Resume Section**: `Skills`
*   **Interactables**:
    *   **Training Dummy 1 (Melee)**: Represents "Languages" (PHP, JS).
    *   **Training Dummy 2 (Magic)**: Represents "Frameworks" (Laravel, React).
    *   **Weapon Rack**: Represents "Tools" (Git, Docker).
*   **Assets Needed**:
    *   `training_dummy.png`
    *   `target.png`

### 3. The Hall of Deeds (Experience)
*   **Concept**: An outdoor gallery or a series of statues/monuments along the path. Each monument tells a story of a past battle (job).
*   **Resume Section**: `Experience`
*   **Interactables**:
    *   **Monument/Statue 1**: Flusso (Recent battle).
    *   **Monument/Statue 2**: Imagine Apps.
    *   **Monument/Statue 3**: DVLOPER.
*   **Assets Needed**:
    *   `statue_heroic.png`
    *   `monument_stone.png`
    *   `notice_board.png`

### 4. The Ancient Library (Education)
*   **Concept**: A ruined or ancient archive structure at the edge of the forest.
*   **Resume Section**: `Education` & `Certifications`
*   **Interactables**:
    *   **Bookshelf / Scroll Stand**: University Degree.
    *   **Old Scroll**: Certifications.
*   **Assets Needed**:
    *   `bookshelf.png`
    *   `scroll_stand.png`

## Implementation Plan
1.  **Map Design**: Update Tiled map to include these regions.
2.  **Code Logic**: Update `PlayScene.js` to detect these specific object names (`cabin`, `dummy_lang`, `monument_flusso`, etc.) and open the corresponding modal content.
3.  **Asset Acquisition**: Download recommended assets from itch.io (e.g., "Generic RPG asset pack", "Fantasy interior pack").

## Recommended Assets (Itch.io)
*   **Environment**: [Legacy Fantasy - High Forest](https://bdragon1727.itch.io/legacy-fantasy-high-forest-20-mood) (Already partially used?)
*   **Props**: [Pixel Art Furniture & Props](https://limezu.itch.io/moderninteriors) (Good for library/cabin)
*   **Training**: [Tiny RPG Forest](https://varrie.itch.io/tiny-rpg-forest) (Has some props)

