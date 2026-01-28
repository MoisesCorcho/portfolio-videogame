<script>
    import { ResumeData } from '../../../data/ResumeData';
    const p = ResumeData.profile;
</script>

<div class="resume-section">
    <h2>{p.name}</h2>
    <h3 class="text-xl text-gray-300">{p.title}</h3>
    <p class="italic text-gray-400">{p.location}</p>
    
    <div class="my-4 p-4 bg-gray-800 rounded">
        <p>{p.summary}</p>
    </div>

    <div class="text-sm">
        <p>📧 {p.contact.email}</p>
        <p>📱 {p.contact.phone}</p>
        <p>
            🔗 <a href={`https://${p.contact.linkedin}`} target="_blank" class="text-blue-400">LinkedIn</a>
        </p>
        <p>
            🌐 <a href={`https://${p.contact.portfolio}`} target="_blank" class="text-blue-400">Portfolio</a>
        </p>
    </div>
</div>

<style>
    h2 {
        color: var(--accent, #ffcc00);
        margin-bottom: 0.5rem;
    }
</style>
