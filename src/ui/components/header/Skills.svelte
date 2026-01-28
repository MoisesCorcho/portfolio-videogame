<script>
    import { ResumeData } from '../../../data/ResumeData';
    const s = ResumeData.skills;
</script>

<div>
    <h2>Skills</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-800 p-3 rounded">
            <h3 class="text-yellow-400 font-bold">Languages</h3>
            <p class="text-sm">{s.languages.join(', ')}</p>
        </div>
        <div class="bg-gray-800 p-3 rounded">
            <h3 class="text-yellow-400 font-bold">Frameworks</h3>
            <p class="text-sm">{s.frameworks.join(', ')}</p>
        </div>
        <div class="bg-gray-800 p-3 rounded">
            <h3 class="text-yellow-400 font-bold">Tools</h3>
            <p class="text-sm">{s.tools.join(', ')}</p>
        </div>
        <div class="bg-gray-800 p-3 rounded">
            <h3 class="text-yellow-400 font-bold">Concepts</h3>
            <p class="text-sm">{s.concepts.join(', ')}</p>
        </div>
    </div>
</div>
