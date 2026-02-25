<script>
    let { text = '...', onclose } = $props();
</script>

<div class="sign-overlay">
    <div class="sign-box">
        <div class="nail nail-tl"></div>
        <div class="nail nail-tr"></div>
        <div class="nail nail-bl"></div>
        <div class="nail nail-br"></div>
        <div class="sign-text">{text.replace(/\\n/g, '\n')}</div>
        <button class="sign-close" onclick={onclose}>X</button>
        <!-- <div class="sign-hint">Press E or click ✕ to close</div> -->
    </div>
</div>

<style>
    .sign-overlay {
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

    .sign-box {
        pointer-events: auto;
        position: relative;
        /* Wood grain base background */
        background-color: #5c3a21;
        background-image: 
            /* Wood grain lines */
            repeating-linear-gradient( 45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px ),
            /* Bark-like texture shadows */
            radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%),
            /* Basic gradient for shading */
            linear-gradient(to bottom, #724729 0%, #462c19 100%);
        /* Thick wooden border effect */
        border: 6px solid #2e1c0f;
        border-radius: 6px;
        padding: 24px 32px 20px 32px;
        width: 90%;
        max-width: 500px;
        /* Deep shadow for depth */
        box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.6),
            inset 0 4px 6px rgba(255, 255, 255, 0.1),
            inset 0 -4px 6px rgba(0, 0, 0, 0.4),
            inset 0 0 10px rgba(0,0,0,0.8);
        text-align: left; /* Changed from center to left */
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Wooden frame/planks corner details (nails) */
    .sign-box .nail {
        position: absolute;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle at 30% 30%, #555, #111);
        border-radius: 50%;
        box-shadow: inset -1px -1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(0,0,0,0.8);
    }
    .nail-tl { top: 12px; left: 12px; }
    .nail-tr { top: 12px; right: 12px; }
    .nail-bl { bottom: 12px; left: 12px; }
    .nail-br { bottom: 12px; right: 12px; }

    @keyframes popIn {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .sign-text {
        font-family: 'Press Start 2P', 'Courier New', monospace;
        font-size: 0.75rem;
        color: #fdf6e3;
        line-height: 1.8;
        min-height: 40px;
        text-transform: uppercase;
        text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .sign-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #8b0000; /* Dark red wood color */
        color: #fdf6e3;
        border: 3px solid #3b0000;
        font-family: 'Press Start 2P', 'Courier New', monospace; /* Keep 8bit font */
        font-size: 0.6rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px; /* Slightly rounded corners for wood block */
        z-index: 20;
        box-shadow: 
            2px 2px 0px rgba(0,0,0,0.8), /* Hard pixel shadow */
            inset 2px 2px 0px rgba(255,255,255,0.2), /* Top highlight */
            inset -2px -2px 0px rgba(0,0,0,0.4); /* Bottom shadow for depth */
        text-shadow: 1px 1px 0px rgba(0,0,0,1);
        transition: transform 0.1s steps(2), filter 0.1s;
    }

    .sign-close:hover {
        filter: brightness(1.2);
        transform: scale(1.1);
    }

    .sign-close:active {
        transform: translateY(2px) translateX(2px);
        box-shadow: 
            0px 0px 0px rgba(0,0,0,0.8),
            inset 2px 2px 0px rgba(0,0,0,0.4),
            inset -2px -2px 0px rgba(255,255,255,0.2);
    }

    .sign-hint {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.3);
        margin-top: 20px;
    }
</style>
