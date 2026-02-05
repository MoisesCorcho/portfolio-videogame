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
        right: 15px; /* Moved slightly more left */
        background: red;
        color: white;
        border: none;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 4px;
        z-index: 20; /* Above scrollbar and content */
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .close-btn:hover {
        background: darkred;
        transform: scale(1.05);
    }
</style>
