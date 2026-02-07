<script>
    import { ResumeData } from '../../../data/ResumeData';
    const s = ResumeData.skills;

    const sections = [
        { title: 'Programación', data: s.programming },
        { title: 'Frameworks & Herramientas', data: s.frameworksAndTools },
        { title: 'Bases de Datos', data: s.databases },
        { title: 'Idiomas', data: s.languages }
    ];

    const formatLevel = (level) => {
        const labels = {
            advanced: 'Avanzado',
            intermediate: 'Intermedio',
            basic: 'Básico',
            native: 'Nativo'
        };
        return labels[level] || level;
    };
</script>

<div>
    <h2 class="text-xl text-amber-400 mb-6 pixel-text-shadow">Habilidades</h2>
    <div class="flex flex-col gap-6">
        {#each sections as section}
            <div class="pixel-panel">
                <div class="metadata-header flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                    <h3 class="text-base font-bold text-white tracking-wider">{section.title}</h3>
                </div>
                <div class="flex flex-col gap-4">
                    {#each Object.entries(section.data) as [level, items]}
                        <div class="mb-2">
                            <span class="text-xs text-amber-500 font-bold uppercase">{formatLevel(level)}</span>
                            <div class="flex flex-wrap gap-1 mt-2">
                                {#each items as item}
                                    <span class="pixel-chip text-xs">{item}</span>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .pixel-text-shadow {
        text-shadow: 2px 2px 0px #000;
    }
</style>
