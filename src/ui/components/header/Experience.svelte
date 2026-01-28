<script>
    import { ResumeData } from '../../../data/ResumeData';
</script>

<div>
    <h2>Experience</h2>
    <div class="space-y-4">
        {#each ResumeData.experience as exp}
            <div class="p-4 bg-gray-800 rounded border border-gray-700">
                <h3 class="text-lg font-bold text-yellow-400">{exp.role}</h3>
                <div class="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{exp.company}</span>
                    <span>{exp.date}</span>
                </div>
                <p class="text-sm mb-2">{exp.description}</p>
                <div class="flex flex-wrap gap-2">
                    {#each exp.stack as s}
                        <span class="px-2 py-1 bg-blue-900 rounded text-xs">{s}</span>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
