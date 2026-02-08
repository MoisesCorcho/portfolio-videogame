<script>
    import { uiStore, closeModal } from './stores/uiStore';
    import { INTERACTION_TYPES } from '../utils/Constants';
    import Modal from './components/Modal.svelte';

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
