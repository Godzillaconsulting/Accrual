const payload1 = {
    firstName: "Empresa",
    lastName: "Contable SA",
    email: "test@contable.com",
    phone: "1234567890",
    message: "Reserva de prueba 60min",
    date: "2026-03-22",
    time: "10:00 am",
    modality: "presencial",
    service: "Consultoría General",
    duration: "60min",
    price: 1000
};

const payload2 = {
    firstName: "Persona",
    lastName: "Fisica",
    email: "test2@fisica.com",
    phone: "0987654321",
    message: "Intento de empalme 30min",
    date: "2026-03-22",
    time: "10:00 am",
    modality: "video",
    service: "Declaración de Impuestos",
    duration: "30min",
    price: 600
};

async function testOverlaps() {
    console.log("== Creando cita original de 60min a las 10:00 am ==");
    let res1;
    try {
        res1 = await fetch('http://localhost:3001/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload1)
        });
        const data1 = await res1.json();
        console.log("Respuesta:", data1);
    } catch (e) { console.error("Error reserva 1:", e); }

    console.log("== Intentando agendar encima de cita a las 10:00 am ==");
    try {
        const res2 = await fetch('http://localhost:3001/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload2)
        });
        const data2 = await res2.json();
        console.log("Respuesta:", data2);
    } catch (e) { console.error("Error reserva 2:", e); }

    console.log("== Comprobando slots disponibles frontend (GET) para ver si 10:30 se bloquea ==");
    try {
        const res3 = await fetch('http://localhost:3001/api/appointments?date=2026-03-22');
        const data3 = await res3.json();
        console.log("Slots reportados por API:", data3);
        
        // Simular la lógica de React para bloquear el siguiente slot de 30 min (10:30 am).
        const unavailable = [];
        data3.forEach(appointment => {
            unavailable.push(appointment.hora);
            if (appointment.duracion === '60min') {
                const timeSlotsArr = [
                    "09:00 am", "09:30 am", "10:00 am",
                    "10:30 am", "11:00 am", "11:30 am"
                ];
                const idx = timeSlotsArr.indexOf(appointment.hora);
                if (idx !== -1 && idx + 1 < timeSlotsArr.length) {
                    unavailable.push(timeSlotsArr[idx + 1]);
                }
            }
        });
        console.log("Horarios calculados como NO DISPONIBLES en frontend:", unavailable);
    } catch (e) { console.error("Error GET slots:", e); }
}

testOverlaps();
