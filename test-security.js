const fetch = globalThis.fetch;

async function runSecurityTests() {
    console.log("=== INICIANDO AUDITORÍA DE SEGURIDAD (LOCAL) ===\n");

    // 1. Probar inyección XSS (Cross Site Scripting)
    console.log("[TEST 1] XSS - Inyectando <script> en nombre y mensaje...");
    const payloadXSS = {
        firstName: "<script>alert('hack')</script>Juan",
        lastName: "Perez",
        email: "juan@test.com",
        phone: "1234567890",
        message: "Hola <iframe>malicioso</iframe>",
        date: "2026-04-10",
        time: "10:00 am",
        modality: "video",
        service: "General"
    };

    try {
        const res1 = await fetch('http://localhost:3001/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadXSS)
        });
        const d1 = await res1.json();
        console.log("XSS Response (Debería limpiar los brackets '<' '>'):", d1);
    } catch(e) {}

    // 2. Probar Payload Excesivo (DoS attack)
    console.log("\n[TEST 2] DoS - Enviando mensaje de 5000 chars...");
    payloadXSS.message = "A".repeat(5000);
    payloadXSS.time = "11:00 am";
    try {
        const res2 = await fetch('http://localhost:3001/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadXSS)
        });
        console.log("Status DoS (Debería ser 400):", res2.status, await res2.json());
    } catch(e) {}

    // 3. Probar Rate Limit en Leads (Spam bots)
    console.log("\n[TEST 3] Spam - 15 peticiones seguidas al Newsletter...");
    for(let i=1; i<=15; i++) {
        const res3 = await fetch('http://localhost:3001/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `bot${i}@spam.com` })
        });
        if(i > 10) {
            console.log(`Petición ${i} (Esperando 429):`, res3.status, await res3.json());
        }
    }
}

runSecurityTests();
