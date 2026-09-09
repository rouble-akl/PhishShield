// mock-api.js — fake VirusTotal-style response for development
// Replace checkUrl() with a real fetch() call to VirusTotal when ready

async function checkUrl(url) {
    // Simulate network delay like a real API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Fake logic: flag anything containing "phish" or "malicious" as dangerous, for easy testing
    const isDangerous = url.includes("phish") || url.includes("malicious") || url.includes("test-danger");

    if (isDangerous) {
        return { malicious: 4, suspicious: 1, harmless: 60 };
    } else {
        return { malicious: 0, suspicious: 0, harmless: 65 };
    }
}