// Fungsi untuk mendapatkan tanggal dan waktu saat ini dalam string yang diformat
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Fungsi untuk button info
document.getElementById('info-btn').addEventListener('click', function () {
    document.getElementById('bmi-form').style.display = 'none';
    document.getElementById('info-form').style.display = 'block';
});

// Fungsi untuk button kembali
document.getElementById('back-btn').addEventListener('click', function () {
    document.getElementById('info-form').style.display = 'none';
    document.getElementById('bmi-form').style.display = 'block';
});

// SweetAlert
function showAlert(message) {
    Swal.fire({
        text: message,
        icon: "error"
    });
}

// Fungsi untuk button calculate
document.getElementById('calculate-btn').addEventListener('click', function () {
    if (validateInputs()) {
        calculateBMI();
    }
});

// Form input
function validateInputs() {
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    // Validasi kelamin
    if (!gender) {
        showAlert('Pilih jenis kelamin terlebih dahulu');
        return false;
    }
    // Validasi usia
    if (isNaN(age) || age <= 0) {
        showAlert('Usia harus berupa angka lebih dari 0');
        return false;
    }
    // Validasi berat
    if (isNaN(weight) || weight <= 0) {
        showAlert('Berat badan harus berupa angka lebih dari 0');
        return false;
    }
    // Validasi tinggi
    if (isNaN(height) || height <= 0) {
        showAlert('Tinggi badan harus berupa angka lebih dari 0');
        return false;
    }
    return true;
}

// Kalkulasi BMI
function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to meters
    const bmi = weight / (height * height);
    displayBMIResult(bmi);
}

// Hasil BMI
function displayBMIResult(bmi) {
    const bmiValue = bmi.toFixed(1);
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    let bmiCategory = '';
    let recommendation = '';
    let healthRisks = '';

    if (bmi < 18.5) {
        bmiCategory = 'Kekurangan berat badan';
        healthRisks = 'Beberapa resiko penyakit yang berasal dari tubuh Kekurangan berat badan yaitu Kekurangan gizi, Gangguan pertumbuhan, Sistem kekebalan tubuh lemah, Gangguan kesuburan';
        recommendation = `Anda berada dalam kategori "${bmiCategory}" maka Anda dianjurkan untuk menambah berat badan hingga batas normal. Perbanyak asupan makanan bergizi dan konsultasikan dengan ahli gizi untuk peningkatan berat badan. ${healthRisks}, BMI tidak sepenuhnya mewakili diagnosis menyeluruh dari kesehatan tubuh dan resiko penyakit seseorang`;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiCategory = 'Normal (ideal)';
        healthRisks = 'Risiko penyakit dalam kategori ini lebih rendah, namun tetap jaga pola hidup sehat.';
        recommendation = `Anda berada dalam kategori "${bmiCategory}" Pertahankan pola makan sehat dan rutin berolahraga untuk menjaga berat badan Anda. ${healthRisks}`;
    } else if (bmi >= 25 && bmi <= 29.9) {
        bmiCategory = 'Kelebihan berat badan';
        healthRisks = 'Beberapa resiko penyakit yang berasal dari tubuh Kelebihan berat badan yaitu, Penyakit jantung, Tekanan darah tinggi, Diabetes tipe 2, Gangguan tidur';
        recommendation = `Anda berada dalam kategori "${bmiCategory}" maka Anda dianjurkan untuk menurunkan berat badan hingga batas normal. Kurangi asupan kalori dan tingkatkan aktivitas fisik Anda. ${healthRisks}, BMI tidak sepenuhnya mewakili diagnosis menyeluruh dari kesehatan tubuh dan resiko penyakit seseorang`;
    } else {
        bmiCategory = 'Kegemukan (Obesitas)';
        healthRisks = 'Beberapa resiko penyakit yang berasal dari tubuh Kegemukan (Obesitas) yaitu Penyakit jantung, Tekanan darah tinggi, Diabetes tipe 2, Gangguan tidur, Penyakit sendi';
        recommendation = `Anda berada dalam kategori "${bmiCategory}" maka Anda sangat dianjurkan untuk menurunkan berat badan hingga batas normal. Konsultasikan dengan dokter atau ahli gizi untuk rencana penurunan berat badan. ${healthRisks}, BMI tidak sepenuhnya mewakili diagnosis menyeluruh dari kesehatan tubuh dan resiko penyakit seseorang`;
    }

    const message = `BMI: ${bmiValue}\nKategori: ${bmiCategory}`;
    const fileName = `BMI_Result_${getFormattedDate()}.pdf`;
    Swal.fire({
        html: `
            <div>${message}</div>
        `,
        icon: "success",
        showCancelButton: true,
        cancelButtonText: "Oke",
        confirmButtonText: "Data Lengkap",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            // Pembuat PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFont("courier", "normal");
            doc.setFontSize(17);
            doc.text("HASIL DATA", 85, 25);
            doc.setFontSize(12);
            doc.text(getFormattedDate(), 148, 10);

            doc.setFontSize(12);
            const header = ['UMUR', 'BERAT', 'TINGGI', 'HASIL'];
            let startX = 25;
            let startY = 40;

            // TABEL
            for (const h of header) {
                doc.rect(startX, startY, 40, 10, 'S');
                doc.text(h, startX + 5, startY + 7);
                startX += 40;
            }
            startX = 25;
            startY += 10;

            // UMUR
            doc.setFontSize(12);
            doc.rect(startX, startY, 40, 10, 'S');
            doc.text(String(age), startX + 5, startY + 7);
            startX += 40;

            // BERAT
            doc.rect(startX, startY, 40, 10, 'S');
            doc.text(String(weight), startX + 5, startY + 7);
            startX += 40;

            // TINGGI
            doc.rect(startX, startY, 40, 10, 'S');
            doc.text(String(height), startX + 5, startY + 7);
            startX += 40;

            // HASIL
            if (bmiCategory === 'Normal (ideal)') {
                doc.setTextColor(0, 0, 255); // Blue
            } else {
                doc.setTextColor(255, 0, 0); // Red
            }
            doc.rect(startX, startY, 40, 10, 'S');
            doc.text(bmiValue, startX + 5, startY + 7);
            doc.setTextColor(0, 0, 0); 
            doc.setFontSize(12);
            doc.text(recommendation, 15, 70, { align: 'justify', maxWidth: 180 });
            doc.save(fileName);
        }
    });
}
