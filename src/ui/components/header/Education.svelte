<script>
    import { ResumeData } from '../../../data/ResumeData';
</script>

<div>
    <h2>Education & Certifications</h2>
    <div class="space-y-4">
        {#each ResumeData.education as edu}
            <div class="p-3 bg-gray-800 rounded border-l-4 border-green-500">
                <h3 class="font-bold">{edu.degree}</h3>
                <p class="text-sm text-gray-300">{edu.school}</p>
                <p class="text-xs text-gray-500">{edu.date}</p>
            </div>
        {/each}
        
        <h3 class="mt-4 text-yellow-400">Certifications</h3>
        <ul class="list-disc pl-5 text-sm">
            {#each ResumeData.certs as cert}
                <li>{cert}</li>
            {/each}
        </ul>
    </div>
</div>
