<script>
    import { ResumeData } from '../../../data/ResumeData';

    export let section = 'all'; // 'all', 'education', 'certs'
</script>

<div>
    {#if section === 'education' || section === 'all'}
        <h2 class="text-xl text-amber-400 mb-6 pixel-text-shadow">Educación</h2>
        <div class="flex flex-col gap-6 mb-8">
            {#each ResumeData.education as edu}
                <div class="pixel-panel">
                    <div class="metadata-header flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                        <h3 class="text-base font-bold text-white tracking-wider">{edu.degree}</h3>
                        <div class="flex flex-col text-right text-xs text-gray-400">
                             <span class="text-amber-500 font-bold uppercase">{edu.school}</span>
                             <span class="italic">{edu.date}</span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if section === 'certs' || section === 'all'}
        <h2 class="text-xl text-amber-400 mb-6 pixel-text-shadow">Certificaciones</h2>
        <div class="flex flex-col gap-4">
             {#each ResumeData.certs as cert}
                <div class="pixel-panel flex items-center gap-3">
                    <div class="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                    <span class="text-sm text-gray-300 font-medium">{cert}</span>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .pixel-text-shadow {
        text-shadow: 2px 2px 0px #000;
    }
</style>
