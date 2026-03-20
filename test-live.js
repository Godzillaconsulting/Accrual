const fetch = globalThis.fetch;

const LIVE_URL = 'https://www.accrual.com.mx/api/appointments';

const tests = [
    {
        name: "1. Reserva exitosa - Asesoría Fiscal a las 09:00 am",
        payload: {
            firstName: "Prueba 1", lastName: "Live", email: "p1@test.com", phone: "6561112233",
            message: "Test 1 en prod", date: "2026-03-26", time: "09:00 am",
            modality: "presencial", service: "Consultoría General", duration: "30min", price: 600
        }
    },
    {
        name: "2. Empalme Intencional - Mismo horario que la prueba 1",
        payload: {
            firstName: "Prueba 2", lastName: "Live", email: "p2@test.com", phone: "6561110000",
            message: "Test empalme", date: "2026-03-26", time: "09:00 am", // Mismo dia e igual hora
            modality: "video", service: "Facturación (CFDI)", duration: "60min", price: 1000
        }
    },
    {
        name: "3. Reserva exitosa - Distinto servicio a las 11:00 am",
        payload: {
            firstName: "Prueba 3", lastName: "Live", email: "p3@test.com", phone: "6563334455",
            message: "Test 3", date: "2026-03-26", time: "11:00 am",
            modality: "video", service: "Administración de Nómina", duration: "60min", price: 1000
        }
    },
    {
        name: "4. Reserva exitosa - Mismo día distinto horario a las 05:00 pm",
        payload: {
            firstName: "Prueba 4", lastName: "Live", email: "p4@test.com", phone: "6569998877",
            message: "Test 4", date: "2026-03-26", time: "05:00 pm",
            modality: "presencial", service: "Registro REPSE", duration: "30min", price: 600
        }
    },
    {
        name: "5. Reserva exitosa - Otro día (Viernes)",
        payload: {
            firstName: "Prueba 5", lastName: "Live", email: "p5@test.com", phone: "6560001122",
            message: "Test 5", date: "2026-03-27", time: "10:30 am",
            modality: "video", service: "Prevención de Lavado (LFPIORPI)", duration: "60min", price: 1000
        }
    }
];

async function runTests() {
    console.log(`=== INICIANDO 5 PRUEBAS EN PRODUCCIÓN (${LIVE_URL}) ===\n`);
    for (const test of tests) {
        console.log(`[PRUEBA] ${test.name}`);
        try {
            const res = await fetch(LIVE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(test.payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                console.log(`✅ ÉXITO: Cita creada con ID ${data.appointmentId || 'ok'}`);
            } else {
                console.log(`❌ BLOQUEADO (Esperado en empalmes): ${data.error}`);
            }
        } catch (error) {
            console.error(`⚠️ ERROR CATASTRÓFICO:`, error.message);
        }
        console.log('--------------------------------------------------');
    }
}

runTests();
