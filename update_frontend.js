const fs = require('fs');

function replaceFormatDonationData(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the formatDonationData function
    const oldFnRegex = /const formatDonationData = \(item: any\): DonaturData => \{[\s\S]*?return \{[\s\S]*?rincianBibit: \[\{[\s\S]*?\}\],[\s\S]*?\};\n\};/;
    
    const newFn = \const formatDonationData = (item: any): DonaturData => {
  let rincian: any[] = [];
  let totalBibit = 0;

  if (Array.isArray(item.seed_details)) {
    rincian = item.seed_details.map((sd: any) => {
      const qty = Number(sd.quantity) || 0;
      totalBibit += qty;
      return {
        nama: sd.name || 'Bibit',
        jumlah: qty,
        hargaSatuan: 0
      };
    });
  }

  if (rincian.length === 1 && item.transaction?.amount) {
     rincian[0].hargaSatuan = Number(item.transaction.amount) / (rincian[0].jumlah || 1);
  }

  return {
    id: item.id,
    idTransaksi: \TRX-\\,
    idDonasi: \DNS-\\,
    namaDonatur: item.donor?.donor_name || 'Hamba Allah',
    program: item.donation_program?.name || 'Program Umum',
    jumlahBibit: totalBibit,
    status: item.seed_status || 'Menunggu Verifikasi',
    tanggalDonasi: item.created_at,
    proof_url: item.proof_url,
    rincianBibit: rincian,
  };
};\;

    content = content.replace(oldFnRegex, newFn);
    fs.writeFileSync(filePath, content);
}

replaceFormatDonationData('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/StaffPDAS/RealisasiBibitDonasi/DataDonatur/DataDonasi.tsx');
replaceFormatDonationData('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/StaffPDAS/RealisasiBibitDonasi/PelaksanaanKegiatan/PelaksanaanKegiatan.tsx');
replaceFormatDonationData('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/StaffPDAS/RealisasiBibitDonasi/Dashboard/DashboardProgram.tsx');

// Also update ExportLaporanModal.tsx
let exportLaporan = fs.readFileSync('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/KepalaBidangPDAS/RealisasiBibitDonasi/DataProgram/components/ExportLaporanModal.tsx', 'utf8');
exportLaporan = exportLaporan.replace(/const bibitTerkumpul = Number\(don.seed_quantity\) \|\| 0;/g, \const bibitTerkumpul = Array.isArray(don.seed_details) ? don.seed_details.reduce((sum: number, sd: any) => sum + (Number(sd.quantity) || 0), 0) : 0;\);
fs.writeFileSync('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/KepalaBidangPDAS/RealisasiBibitDonasi/DataProgram/components/ExportLaporanModal.tsx', exportLaporan);

// Update DashboardProgram.tsx additional usages
let dashProg = fs.readFileSync('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/StaffPDAS/RealisasiBibitDonasi/Dashboard/DashboardProgram.tsx', 'utf8');
dashProg = dashProg.replace(/\{item\.seed_quantity\} Bibit \{item\.seed\?\.name \? \\\\(\\\$\\{item\.seed\.name\\}\)\\\ : \"\"\} - \{item\.donation_program\?\.name \|\| \"Program\"\}/g, \{Array.isArray(item.seed_details) ? item.seed_details.map((sd: any) => \ Bibit (\)).join(', ') : '0 Bibit'} - {item.donation_program?.name || "Program"}\);
fs.writeFileSync('C:/Users/Varrel/Downloads/DISHUT/FE/dishut-frontend/src/pages/StaffPDAS/RealisasiBibitDonasi/Dashboard/DashboardProgram.tsx', dashProg);

console.log('Done!');
