const payload = {
    firstName: "TestUser",
    lastName: "Verification",
    email: "test@example.com",
    phone: "1234567890",
    message: "Testing constraints",
    date: "2026-03-20",
    time: "09:00 am",
    modality: "video",
    service: "Consultoría General",
    duration: "30min",
    price: 600
};

fetch('http://localhost:3001/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log('POST Response:', data))
.catch(err => console.error(err));
