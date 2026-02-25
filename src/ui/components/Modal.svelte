<script>
    let { onclose, children } = $props();
</script>

<div class="modal-overlay">
    <div class="modal-content">
        <button class="close-btn" onclick={onclose}>X</button>
        <div class="scroll-container">
            {@render children()}
        </div>
    </div>
</div>

<style>
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: 100;
    }

    .modal-content {
        pointer-events: auto;
        background: var(--modal-bg, rgba(20, 20, 30, 0.95));
        border: 4px solid var(--accent, #ffcc00);
        width: 90%;
        max-width: 900px;
        max-height: 80vh;
        position: relative;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden; /* Clips children to radius */
    }

    .scroll-container {
        overflow-y: auto;
        flex: 1; /* Takes remaining height */
        padding: 2rem; /* Content padding moved here */
        padding-top: 3rem; /* Extra top padding to clear the Close Button */
    }

    /* Custom Scrollbar Styles */
    .scroll-container::-webkit-scrollbar {
        width: 8px;
    }
    .scroll-container::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    .scroll-container::-webkit-scrollbar-thumb {
        background: var(--accent, #ffcc00);
        border-radius: 4px;
    }
    .scroll-container::-webkit-scrollbar-thumb:hover {
        background: #e6b800;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        background: #8b0000; /* Dark red wood color */
        color: #fdf6e3;
        border: 3px solid #3b0000;
        font-family: 'Press Start 2P', 'Courier New', monospace; /* Keep 8bit font */
        font-size: 0.6rem;
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px; /* Slightly rounded corners for wood block */
        z-index: 20; /* Above scrollbar and content */
        box-shadow: 
            2px 2px 0px rgba(0,0,0,0.8), /* Hard pixel shadow */
            inset 2px 2px 0px rgba(255,255,255,0.2), /* Top highlight */
            inset -2px -2px 0px rgba(0,0,0,0.4); /* Bottom shadow for depth */
        text-shadow: 1px 1px 0px rgba(0,0,0,1);
        transition: transform 0.1s steps(2), filter 0.1s;
    }

    .close-btn:hover {
        filter: brightness(1.2);
        transform: scale(1.1);
    }

    .close-btn:active {
        transform: translateY(2px) translateX(2px);
        box-shadow: 
            0px 0px 0px rgba(0,0,0,0.8),
            inset 2px 2px 0px rgba(0,0,0,0.4),
            inset -2px -2px 0px rgba(255,255,255,0.2);
    }
</style>
