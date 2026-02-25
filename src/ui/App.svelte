<script>
    import { uiStore, closeModal } from './stores/uiStore';
    import { INTERACTION_TYPES } from '../utils/Constants';
    import Modal from './components/Modal.svelte';
    import Dialogue from './components/Dialogue.svelte';
    import Sign from './components/Sign.svelte';

    // Views
    import Profile from './components/header/Profile.svelte';
    import Experience from './components/header/Experience.svelte';
    import SingleExperience from './components/header/SingleExperience.svelte';
    import Skills from './components/header/Skills.svelte';
    import Education from './components/header/Education.svelte';

    // Subscribe to store
    let state;
    uiStore.subscribe(value => {
        state = value;
    });

    const close = () => {
        closeModal();
        // Resume Game Logic
        if (window.gameInstance) {
            window.gameInstance.scene.resume('PlayScene');
        }
    };
</script>

{#if state.isOpen}
    {#if state.view === INTERACTION_TYPES.NPC}
        <!-- NPC Dialogue uses its own lightweight box, not the full Modal -->
        <Dialogue
            npcName={state.data?.name ?? 'NPC'}
            phrase={state.data?.phrase ?? '...'}
            onclose={close}
        />
    {:else if state.view === INTERACTION_TYPES.SIGN}
        <!-- Sign View uses its own lightweight wooden box -->
        <Sign
            text={state.data?.text ?? '...'}
            onclose={close}
        />
    {:else}
        <Modal onclose={close}>
            {#if state.view === INTERACTION_TYPES.PROFILE}
                <Profile />
            {:else if state.view === INTERACTION_TYPES.EXPERIENCE}
                <Experience />
            {:else if state.view === INTERACTION_TYPES.SINGLE_EXPERIENCE}
                <SingleExperience />
            {:else if state.view === INTERACTION_TYPES.SKILLS}
                <Skills />
            {:else if state.view === INTERACTION_TYPES.EDUCATION}
                <Education section="education" />
            {:else if state.view === INTERACTION_TYPES.CERTS}
                <Education section="certs" />
            {:else}
                <p>Unknown view: {state.view}</p>
            {/if}
        </Modal>
    {/if}
{/if}
