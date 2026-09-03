import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPlus, HiOutlineCloud, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getKthProgramsAPI, getLaporanKeuanganByIdAPI, updateLaporanKeuanganAPI } from '@/services/investasi.service';

interface Transaksi {
    tanggal: string;
    keterangan: string;
    nominal: number;
    dokumen: string;
}

const EditLaporanKeuangan = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [programs, setPrograms] = useState<any[]>([]);
    const [programId, setProgramId] = useState('');
    const [periodeAwal, setPeriodeAwal] = useState('');
    const [periodeAkhir, setPeriodeAkhir] = useState('');
    const [pendapatan, setPendapatan] = useState<Transaksi[]>([]);
    const [pengeluaran, setPengeluaran] = useState<Transaksi[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const [resPrograms, resLaporan] = await Promise.all([
                    getKthProgramsAPI(),
                    getLaporanKeuanganByIdAPI(id)
                ]);
                setPrograms(resPrograms);
                setProgramId(resLaporan.program_id || '');
                setPeriodeAwal(resLaporan.periode_awal ? resLaporan.periode_awal.split('T')[0] : '');
                setPeriodeAkhir(resLaporan.periode_akhir ? resLaporan.periode_akhir.split('T')[0] : '');
                
                if (resLaporan.rincian_pendapatan && Array.isArray(resLaporan.rincian_pendapatan)) {
                    setPendapatan(resLaporan.rincian_pendapatan.map((p: any) => ({
                        tanggal: p.tanggal || '',
                        keterangan: p.keterangan || '',
                        nominal: Number(p.nominal) || 0,
                        dokumen: p.dokumen || ''
                    })));
                }

                if (resLaporan.rincian_pengeluaran && Array.isArray(resLaporan.rincian_pengeluaran)) {
                    setPengeluaran(resLaporan.rincian_pengeluaran.map((p: any) => ({
                        tanggal: p.tanggal || '',
                        keterangan: p.keterangan || '',
                        nominal: Number(p.nominal) || 0,
                        dokumen: p.dokumen || ''
                    })));
                }

            } catch (err: any) {
                toast.error(err.message || 'Gagal memuat data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [id]);

    const handleAddPendapatan = () => {
        setPendapatan([...pendapatan, { tanggal: '', keterangan: '', nominal: 0, dokumen: 'https://link.com/bukti1.jpg' }]);
    };

    const handleUpdatePendapatan = (index: number, field: keyof Transaksi, value: any) => {
        const newPendapatan = [...pendapatan];
        newPendapatan[index] = { ...newPendapatan[index], [field]: value };
        setPendapatan(newPendapatan);
    };

    const handleRemovePendapatan = (index: number) => {
        setPendapatan(pendapatan.filter((_, i) => i !== index));
    };

    const handleAddPengeluaran = () => {
        setPengeluaran([...pengeluaran, { tanggal: '', keterangan: '', nominal: 0, dokumen: 'https://link.com/bukti2.jpg' }]);
    };

    const handleUpdatePengeluaran = (index: number, field: keyof Transaksi, value: any) => {
        const newPengeluaran = [...pengeluaran];
        newPengeluaran[index] = { ...newPengeluaran[index], [field]: value };
        setPengeluaran(newPengeluaran);
    };

    const handleRemovePengeluaran = (index: number) => {
        setPengeluaran(pengeluaran.filter((_, i) => i !== index));
    };

    const totalPendapatan = pendapatan.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
    const totalPengeluaran = pengeluaran.reduce((acc, curr) => acc + (Number(curr.nominal) || 0), 0);
    const labaBersih = totalPendapatan - totalPengeluaran;
    
    const selectedProgram = programs.find(p => p.id === programId);
    const persentaseKTH = selectedProgram?.persentase_keuntungan ? parseFloat(selectedProgram.persentase_keuntungan) : 60;
    const persentaseInvestor = 100 - persentaseKTH;
    
    const hakKTH = labaBersih > 0 ? labaBersih * (persentaseKTH / 100) : 0;
    const hakInvestor = labaBersih > 0 ? labaBersih * (persentaseInvestor / 100) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAgreed) return;
        if (!programId || !periodeAwal || !periodeAkhir) {
            toast.error("Harap lengkapi program dan periode laporan");
            return;
        }
        if (!id) return;

        const payload = {
            program_id: programId,
            periode_awal: periodeAwal,
            periode_akhir: periodeAkhir,
            bukti_nota_url: "https://link-dokumen.com/nota.pdf",
            status: "SUBMITTED",
            total_pendapatan: pendapatan.map(p => ({ ...p, nominal: Number(p.nominal) })),
            total_pengeluaran: pengeluaran.map(p => ({ ...p, nominal: Number(p.nominal) }))
        };

        try {
            setIsSubmitting(true);
            await updateLaporanKeuanganAPI(id, payload);
            toast.success("Laporan keuangan berhasil diperbarui!");
            navigate(-1);
        } catch (err: any) {
            toast.error(err.message || 'Gagal memperbarui laporan keuangan.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Memuat data laporan...</div>;
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="relative mb-12 flex items-center justify-center">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-0 flex items-center gap-2 text-sm font-bold text-[#185325] hover:underline"
                >
                    <HiOutlineChevronLeft className="stroke-2" /> Kembali
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mt-8 md:mt-0">Edit Laporan Keuangan</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                
                {/* Info Umum */}
                <section>
                    <h2 className="text-lg font-bold text-[#185325] mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#DCECE0] flex items-center justify-center text-sm">1</span>
                        Informasi Umum
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Program Investasi *</label>
                            <select 
                                value={programId}
                                onChange={(e) => setProgramId(e.target.value)}
                                className="w-full text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all"
                                required
                            >
                                <option value="" disabled>Pilih program...</option>
                                {programs.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nama_program_investasi || p.nama_program}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Periode Awal *</label>
                                <input 
                                    type="date" 
                                    value={periodeAwal}
                                    onChange={(e) => setPeriodeAwal(e.target.value)}
                                    className="w-full text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-2">Periode Akhir *</label>
                                <input 
                                    type="date" 
                                    value={periodeAkhir}
                                    onChange={(e) => setPeriodeAkhir(e.target.value)}
                                    className="w-full text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rincian Pendapatan */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#185325] flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#DCECE0] flex items-center justify-center text-sm">2</span>
                            Rincian Pendapatan
                        </h2>
                        <button 
                            type="button" 
                            onClick={handleAddPendapatan}
                            className="flex items-center gap-1.5 text-sm font-bold text-[#185325] hover:underline"
                        >
                            <HiPlus className="stroke-2" /> Tambah Baris
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {pendapatan.map((row, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <input 
                                    type="date" 
                                    value={row.tanggal}
                                    onChange={(e) => handleUpdatePendapatan(idx, 'tanggal', e.target.value)}
                                    className="w-full sm:w-40 text-sm p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Keterangan..." 
                                    value={row.keterangan}
                                    onChange={(e) => handleUpdatePendapatan(idx, 'keterangan', e.target.value)}
                                    className="flex-1 w-full text-sm p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                    required
                                />
                                <div className="relative w-full sm:w-48">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={row.nominal || ''}
                                        onChange={(e) => handleUpdatePendapatan(idx, 'nominal', e.target.value)}
                                        className="w-full text-sm pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                        required
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRemovePendapatan(idx)}
                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus baris"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {pendapatan.length === 0 && (
                            <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
                                Belum ada rincian pendapatan.
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <span className="text-sm font-bold text-gray-800 bg-[#DCECE0] px-4 py-2 rounded-lg">
                                Total Pendapatan: Rp {totalPendapatan.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Rincian Pengeluaran */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-[#185325] flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#DCECE0] flex items-center justify-center text-sm">3</span>
                            Rincian Pengeluaran
                        </h2>
                        <button 
                            type="button" 
                            onClick={handleAddPengeluaran}
                            className="flex items-center gap-1.5 text-sm font-bold text-[#185325] hover:underline"
                        >
                            <HiPlus className="stroke-2" /> Tambah Baris
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {pengeluaran.map((row, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <input 
                                    type="date" 
                                    value={row.tanggal}
                                    onChange={(e) => handleUpdatePengeluaran(idx, 'tanggal', e.target.value)}
                                    className="w-full sm:w-40 text-sm p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Keterangan..." 
                                    value={row.keterangan}
                                    onChange={(e) => handleUpdatePengeluaran(idx, 'keterangan', e.target.value)}
                                    className="flex-1 w-full text-sm p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                    required
                                />
                                <div className="relative w-full sm:w-48">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
                                    <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={row.nominal || ''}
                                        onChange={(e) => handleUpdatePengeluaran(idx, 'nominal', e.target.value)}
                                        className="w-full text-sm pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#185325]"
                                        required
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRemovePengeluaran(idx)}
                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus baris"
                                >
                                    <HiOutlineTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {pengeluaran.length === 0 && (
                            <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm">
                                Belum ada rincian pengeluaran.
                            </div>
                        )}
                        <div className="flex justify-end pt-2">
                            <span className="text-sm font-bold text-gray-800 bg-[#DCECE0] px-4 py-2 rounded-lg">
                                Total Pengeluaran: Rp {totalPengeluaran.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Ringkasan */}
                <section>
                    <h2 className="text-lg font-bold text-[#185325] mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#DCECE0] flex items-center justify-center text-sm">4</span>
                        Ringkasan
                    </h2>
                    <div className="bg-[#DCECE0] p-6 rounded-2xl flex flex-col gap-3 border border-[#185325]/10">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Laba Bersih</span>
                            <span className="font-bold text-gray-800">Rp {labaBersih.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Hak KTH ({persentaseKTH}%)</span>
                            <span className="font-bold text-[#185325]">Rp {hakKTH.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">Hak Investor ({persentaseInvestor}%)</span>
                            <span className="font-bold text-gray-800">Rp {hakInvestor.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </section>

                {/* Upload Dokumen & Persetujuan */}
                <section>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <div className="mb-6">
                            <label className="text-sm font-bold text-gray-700 block mb-2">Upload Nota Pembayaran (PDF) *</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <HiOutlineCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="mb-1 text-sm text-gray-500"><span className="font-bold text-[#185325]">Klik untuk upload</span> atau drag and drop</p>
                                    <p className="text-xs text-gray-400">PDF, MAX. 5MB</p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf" />
                            </label>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#185325] bg-white border-gray-300 rounded focus:ring-[#185325]" 
                            />
                            <span className="text-sm text-gray-600 leading-relaxed">
                                Saya menyatakan bahwa seluruh data rincian pendapatan dan pengeluaran beserta dokumen bukti yang dilampirkan adalah <span className="font-bold text-gray-800">benar dan dapat dipertanggungjawabkan</span>.
                            </span>
                        </label>
                    </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button 
                        type="submit" 
                        disabled={!isAgreed || isSubmitting}
                        className={`px-8 py-3.5 text-white text-sm font-bold rounded-full shadow-md transition-all active:scale-95 ${
                            isAgreed && !isSubmitting ? 'bg-[#185325] hover:bg-[#123d1c]' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Kirim Laporan'}
                    </button>
                </div>
                
            </form>
        </div>
    );
};

export default EditLaporanKeuangan;