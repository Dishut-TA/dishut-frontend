const fetch = require('node-fetch');

(async () => {
    try {
        const payload = {
            penyuluh_id: "5",
            source_type: "App\\Models\\AnalysisResultZone",
            source_id: "1",
            jenis_kegiatan: "Validasi Lokasi",
            tanggal_mulai: null,
            batas_waktu: null,
            arahan: null
        };
        const res = await fetch('http://127.0.0.1:8000/api/penugasan', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
})();
