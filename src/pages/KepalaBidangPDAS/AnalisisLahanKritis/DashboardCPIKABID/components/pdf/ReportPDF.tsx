import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { CPIDataRow } from '@/pages/StaffPDAS/AnalisisLahanKritis/AnalisisCPI/types';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, paddingBottom: 60, fontFamily: 'Helvetica' },
  
  // Header Enhancements
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#185325',
    paddingBottom: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    textAlign: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#185325' }, // Title dikembalikan ke warna hijau agar terlihat
  subtitle: { fontSize: 10, color: '#4B5563' },
  
  // Map Styling
  mapBox: {
    width: '100%',
    height: 250,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapImage: { width: '100%', height: '100%', objectFit: 'cover' },
  mapCaption: { fontSize: 9, color: '#6B7280', marginTop: 4, textAlign: 'center', fontStyle: 'italic' },

  // Summary Styling
  summaryBox: { padding: 10, backgroundColor: '#E8F5E9', borderRadius: 4, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderColor: '#C6EBD6' },
  summaryText: { fontSize: 10, fontWeight: 'bold', color: '#185325' },
  
  // Table Styling
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableHeader: { backgroundColor: '#185325', color: '#FFFFFF', fontWeight: 'bold' },
  tableCol1: { width: '5%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCol2: { width: '22%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCol3: { width: '20%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCol4: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCol5: { width: '10%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  tableCol6: { width: '28%', borderStyle: 'solid', borderWidth: 1, borderColor: '#D1D5DB', borderLeftWidth: 0, borderTopWidth: 0 },
  
  // Typography dalam Tabel (DIPISAH ANTARA HEADER DAN ISI)
  tableHeaderCell: { margin: 6, fontSize: 8, color: '#FFFFFF', fontWeight: 'bold' }, // Putih untuk header
  tableCell: { margin: 6, fontSize: 8, color: '#3A4D3F' }, // Warna Text Army untuk isi tabel
  tableCellSub: { marginHorizontal: 6, marginBottom: 2, fontSize: 7, color: '#5C6B61' }, // Warna sub-text army muda
  tableCellCoord: { marginHorizontal: 6, marginBottom: 6, fontSize: 6, color: '#819186', fontFamily: 'Helvetica-Oblique' }, 
  
  // Signature Block Styling
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20
  },
  signatureBox: {
    width: 200,
    alignItems: 'center',
  },
  signatureText: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4
  },
  signatureSpace: {
    height: 60, 
  },
  signatureName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textDecoration: 'underline',
    color: '#111827'
  },
  signatureNip: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2
  },

  // Footer Styling
  footer: { position: 'absolute', bottom: 20, left: 30, right: 30, textAlign: 'center', color: '#9CA3AF', fontSize: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 5 }
});

interface ExtendedCPIDataRow extends CPIDataRow {
  latitude?: number | string;
  longitude?: number | string;
  luas?: number | string;
  cdk?: string;
}

interface ReportPDFProps {
  data: ExtendedCPIDataRow[];
  projectName?: string;
  mapImage?: string | null;
}

const ReportPDF: React.FC<ReportPDFProps> = ({ data, projectName = 'Keseluruhan', mapImage }) => {
  const dateObj = new Date();
  const dateFormatted = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const totalSangatKritis = data.filter(d => d.statusKekritisan?.toLowerCase().includes('sangat kritis')).length;
  const totalKritis = data.filter(d => d.statusKekritisan?.toLowerCase() === 'kritis').length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Laporan Analisis Conservation Priority Index (CPI)</Text>
            <Text style={styles.subtitle}>Filter Peta: {projectName}   |   Tanggal Cetak: {dateFormatted}</Text>
          </View>
        </View>

        {/* MAP IMAGE */}
        {mapImage && (
          <View>
            <View style={styles.mapBox}>
              <Image src={mapImage} style={styles.mapImage} />
            </View>
            <Text style={styles.mapCaption}>Tangkapan Layar Peta Spasial Prioritas Rehabilitasi Hutan dan Lahan</Text>
          </View>
        )}

        {/* SUMMARY */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total Area: {data.length} Lokasi</Text>
          <Text style={styles.summaryText}>Sangat Kritis: {totalSangatKritis} Lokasi</Text>
          <Text style={styles.summaryText}>Kritis: {totalKritis} Lokasi</Text>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          
          {/* BARIS HEADER (MENGGUNAKAN tableHeaderCell) */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol1}><Text style={styles.tableHeaderCell}>No</Text></View>
            <View style={styles.tableCol2}><Text style={styles.tableHeaderCell}>Lokasi Area</Text></View>
            <View style={styles.tableCol3}><Text style={styles.tableHeaderCell}>Data KTH & Wilayah</Text></View>
            <View style={styles.tableCol4}><Text style={styles.tableHeaderCell}>Kondisi Lahan</Text></View>
            <View style={styles.tableCol5}><Text style={styles.tableHeaderCell}>Skor CPI</Text></View>
            <View style={styles.tableCol6}><Text style={styles.tableHeaderCell}>Rekomendasi Intervensi</Text></View>
          </View>

          {/* BARIS ISI TABEL (MENGGUNAKAN tableCell) */}
          {data.map((row, index) => (
            <View style={styles.tableRow} key={row.id}>
              
              {/* Kolom No */}
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              
              {/* Kolom Lokasi */}
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>Desa {row.desa}</Text>
                <Text style={styles.tableCellSub}>Kec. {row.kecamatan}, {row.kabupaten}</Text>
                <Text style={styles.tableCellCoord}>
                  Lat: {row.latitude ? Number(row.latitude).toFixed(5) : '-'} | Lng: {row.longitude ? Number(row.longitude).toFixed(5) : '-'}
                </Text>
              </View>
              
              {/* Kolom Data KTH */}
              <View style={styles.tableCol3}>
                <Text style={styles.tableCell}>{row.namaKth || '-'}</Text>
                <Text style={styles.tableCellSub}>Ketua: {row.ketuaKth || '-'}</Text>
                <Text style={styles.tableCellSub}>Wilayah: {row.cdk || '-'}</Text>
              </View>
              
              {/* Kolom Status */}
              <View style={styles.tableCol4}>
                <Text style={styles.tableCell}>{row.statusKekritisan || '-'}</Text>
                <Text style={styles.tableCellSub}>Luas: {row.luas ? `${row.luas} Ha` : '-'}</Text>
              </View>
              
              {/* Kolom Skor */}
              <View style={styles.tableCol5}>
                <Text style={styles.tableCell}>{row.skorCPI || '-'}</Text>
              </View>
              
              {/* Kolom Rekomendasi */}
              <View style={styles.tableCol6}>
                <Text style={styles.tableCell}>{row.rekomendasi || '-'}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SIGNATURE BLOCK */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Bandung, {dateFormatted}</Text>
            <Text style={styles.signatureText}>Kepala Bidang PDAS</Text>
            
            <View style={styles.signatureSpace} />
            
            <Text style={styles.signatureName}>Lasmawati</Text>
            <Text style={styles.signatureNip}>NIP. 19750817 200112 1 003</Text>
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Dokumen dihasilkan oleh Sistem SIGAP Jabar | Halaman ${pageNumber} dari ${totalPages}`
        )} fixed />
        
      </Page>
    </Document>
  );
};

export default ReportPDF;