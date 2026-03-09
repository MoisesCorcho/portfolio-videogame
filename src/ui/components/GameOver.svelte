<script>
    let { onrestart } = $props();
</script>

<div class="gameover-overlay">
    <div class="gameover-box">
        <h1 class="gameover-title">YOU DIED</h1>
        <div class="skull">💀</div>
        <button class="restart-btn" onclick={onrestart}>
            PLAY AGAIN
        </button>
    </div>
</div>

<style>
    .gameover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        pointer-events: all;
        animation: fadeIn 0.8s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    .gameover-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .gameover-title {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: clamp(1.5rem, 5vw, 3rem);
        color: #cc0000;
        text-shadow:
            0 0 10px rgba(200, 0, 0, 0.8),
            0 0 30px rgba(200, 0, 0, 0.4),
            3px 3px 0px #000;
        letter-spacing: 0.2em;
        margin: 0;
        animation: flicker 2.5s infinite;
    }

    @keyframes flicker {
        0%, 95%, 100% { opacity: 1; }
        96%            { opacity: 0.7; }
        98%            { opacity: 0.9; }
    }

    .skull {
        font-size: clamp(2rem, 6vw, 4rem);
        filter: grayscale(1) brightness(0.6);
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.1); }
    }

    .restart-btn {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: clamp(0.5rem, 1.5vw, 0.75rem);
        color: #fdf6e3;
        background: #1a1a2e;
        border: 3px solid #ffcc00;
        padding: 0.9rem 2rem;
        cursor: pointer;
        letter-spacing: 0.1em;
        box-shadow:
            3px 3px 0px #000,
            inset 2px 2px 0px rgba(255, 255, 255, 0.1);
        transition: transform 0.1s steps(2), filter 0.1s;
    }

    .restart-btn:hover {
        filter: brightness(1.3);
        transform: scale(1.05);
        border-color: #fff;
    }

    .restart-btn:active {
        transform: translateY(2px) translateX(2px);
        box-shadow: 0px 0px 0px #000;
    }
</style>
