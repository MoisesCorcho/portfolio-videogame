<script>
    let { npcName = 'NPC', phrase = '...', onclose } = $props();
</script>

<div class="dialogue-overlay">
    <div class="dialogue-box">
        <div class="dialogue-name">{npcName}</div>
        <div class="dialogue-text">{phrase}</div>
        <button class="dialogue-close" onclick={onclose}>X</button>
        <!-- <div class="dialogue-hint">Press E or click ✕ to close</div> -->
    </div>
</div>

<style>
    .dialogue-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 32px;
        pointer-events: none;
        z-index: 100;
    }

    .dialogue-box {
        pointer-events: auto;
        position: relative;
        background: linear-gradient(
            135deg,
            rgba(15, 15, 30, 0.92) 0%,
            rgba(25, 20, 50, 0.95) 100%
        );
        border: 2px solid rgba(255, 204, 0, 0.6);
        border-radius: 12px;
        padding: 20px 28px 16px 28px;
        width: 90%;
        max-width: 600px;
        box-shadow:
            0 0 20px rgba(255, 204, 0, 0.15),
            0 8px 32px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(12px);
        animation: slideUp 0.25s ease-out;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .dialogue-name {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: 0.75rem;
        color: #ffcc00;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 10px;
        text-shadow: 0 0 8px rgba(255, 204, 0, 0.4);
    }

    .dialogue-text {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: 0.75rem;
        color: #e0dce8;
        line-height: 1.6;
        min-height: 40px;
    }

    .dialogue-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #8b0000;
        color: #fdf6e3;
        border: 3px solid #3b0000;
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: 0.6rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        z-index: 20;
        box-shadow: 
            2px 2px 0px rgba(0,0,0,0.8),
            inset 2px 2px 0px rgba(255,255,255,0.2),
            inset -2px -2px 0px rgba(0,0,0,0.4);
        text-shadow: 1px 1px 0px rgba(0,0,0,1);
        transition: transform 0.1s steps(2), filter 0.1s;
    }

    .dialogue-close:hover {
        filter: brightness(1.2);
        transform: scale(1.1);
    }

    .dialogue-close:active {
        transform: translateY(2px) translateX(2px);
        box-shadow: 
            0px 0px 0px rgba(0,0,0,0.8),
            inset 2px 2px 0px rgba(0,0,0,0.4),
            inset -2px -2px 0px rgba(255,255,255,0.2);
    }

    .dialogue-hint {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.25);
        text-align: right;
        margin-top: 10px;
    }
</style>
