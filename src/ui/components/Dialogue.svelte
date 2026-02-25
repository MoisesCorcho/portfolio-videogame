<script>
    let { npcName = 'NPC', phrase = '...', onclose } = $props();
</script>

<div class="dialogue-overlay">
    <div class="dialogue-box">
        <div class="dialogue-name">{npcName}</div>
        <div class="dialogue-text">{phrase}</div>
        <button class="dialogue-close" onclick={onclose}>✕</button>
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
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.95rem;
        color: #e0dce8;
        line-height: 1.6;
        min-height: 40px;
    }

    .dialogue-close {
        position: absolute;
        top: 8px;
        right: 12px;
        background: transparent;
        color: rgba(255, 255, 255, 0.4);
        border: none;
        font-size: 1rem;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.15s ease;
    }

    .dialogue-close:hover {
        color: #ff4444;
        background: rgba(255, 68, 68, 0.1);
    }

    .dialogue-hint {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.25);
        text-align: right;
        margin-top: 10px;
    }
</style>
