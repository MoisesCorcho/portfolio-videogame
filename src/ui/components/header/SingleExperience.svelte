<script>
    import { uiStore } from '../../stores/uiStore';
    import { ResumeData } from '../../../data/ResumeData';

    // Get the experience data from the store
    let state;
    uiStore.subscribe(value => {
        state = value;
    });

    // Find the specific experience by ID
    $: experience = ResumeData.experience.find(exp => exp.id === state.data?.id);
</script>

{#if experience}
    <div class="flex flex-col h-full">
        <!-- Title & Role -->
        <h2 class="text-xl text-amber-400 mb-6 pixel-text-shadow">{experience.role}</h2>
        
        <div class="pixel-panel flex-grow">
            <!-- Metadata Section -->
            <div class="metadata-header flex flex-col gap-2 mb-4">
                <div class="flex items-center gap-2">
                    <span class="text-amber-500 font-bold text-sm">EMPRESA: </span>
                    <span class="text-base font-bold text-white tracking-wider">{experience.company}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-blue-400 font-bold text-sm">FECHA: </span>
                    <span class="text-sm text-gray-300 italic">{experience.date}</span>
                </div>
            </div>

            <!-- Description -->
            <div class="mb-6">
                <p class="text-sm leading-relaxed text-gray-200">
                    {experience.description}
                </p>
            </div>

            <!-- Skills/Stack -->
            <div class="mt-auto">
                <div class="text-xs text-amber-500 font-bold mb-3 uppercase tracking-widest border-b border-amber-900/30 pb-1">
                    Tecnologías
                </div>
                <div class="flex flex-wrap gap-1">
                    {#each experience.stack as tech}
                        <span class="pixel-chip text-xs hover:bg-amber-900 transition-colors cursor-default">
                            {tech}
                        </span>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="pixel-panel border-red-900">
        <h2 class="text-xl font-bold mb-4 text-red-500">Error: 404</h2>
        <p class="text-gray-400">Datos de experiencia no encontrados.</p>
    </div>
{/if}

<style>
    .pixel-text-shadow {
        text-shadow: 2px 2px 0px #000;
    }
</style>
