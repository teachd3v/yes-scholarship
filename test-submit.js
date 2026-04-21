const fs = require('fs');
async function run() {
  const formData = new FormData();
  formData.append('nama', 'Tester Ageng');
  formData.append('email', 'test@example.com');
  formData.append('nik', '1234567890123456');
  formData.append('whatsapp', '081234567890');
  
  try {
    console.log("Submitting test application...");
    const res = await fetch('http://localhost:3000/api/application/submit', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Fetch Exception:", e);
  }
}
run();
