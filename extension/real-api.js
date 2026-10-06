const VT_API_KEY = "0c10c75b9757ff6a1bf8ffbf21742d39b6614705a789e68c049e80af429f5f80";

async function checkUrl(url) {
    const headers = { "x-apikey": VT_API_KEY };
    const submit = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
        body: "url=" + encodeURIComponent(url)
    });
    const submitJson = await submit.json();
    if (!submitJson.data) {
        console.log("Submit failed:", submitJson);
        throw new Error(submitJson.error ? submitJson.error.message : "Submit failed — likely rate limited");
    }
    const id = submitJson.data.id;

    for (let i = 0; i < 15; i++) {
        const res = await fetch(`https://www.virustotal.com/api/v3/analyses/${id}`, { headers });
        const data = (await res.json()).data;
        console.log("Attempt", i, "status:", data.attributes.status);
        if (data.attributes.status === "completed") return data.attributes.stats;
        await new Promise(r => setTimeout(r, 6000));
    }
    throw new Error("Scan timed out");
}