<script>
    import { ResumeData } from '../../../data/ResumeData';
</script>

<div>
    <h2 class="text-xl text-amber-400 mb-6 pixel-text-shadow">Trayectoria</h2>
    <div class="flex flex-col gap-6">
        {#each ResumeData.experience as exp}
            <div class="pixel-panel">
                <div class="metadata-header flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                    <h3 class="text-base font-bold text-white tracking-wider">{exp.role}</h3>
                    <div class="flex flex-col text-xs text-gray-400">
                        <span class="text-amber-500 font-bold uppercase">{exp.company}</span>
                        <span class="italic">{exp.date}</span>
                    </div>
                </div>
                <p class="text-sm mb-4 text-gray-300 leading-relaxed">{exp.description}</p>
                <div class="flex flex-wrap gap-1">
                    {#each exp.stack as s}
                        <span class="pixel-chip text-xs">{s}</span>
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
