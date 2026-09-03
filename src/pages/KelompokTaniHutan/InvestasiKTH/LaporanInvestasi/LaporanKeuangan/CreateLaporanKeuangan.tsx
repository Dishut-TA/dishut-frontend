import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPlus, HiOutlineCloud, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getKthProgramsAPI, createLaporanKeuanganAPI } from '@/services/investasi.service';

interface Transaksi {
    tanggal: string;
    keterangan: string;
    nominal: number;
    dokumen: string;
}

const CreateLaporanKeuangan = () => {
    const navigate = useNavigate();
    const [isAgreed, setIsAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [programs, setPrograms] = useState<any[]>([]);
    const [programId, setProgramId] = useState('');
    const [periodeAwal, setPeriodeAwal] = useState('');
    const [periodeAkhir, setPeriodeAkhir] = useState('');
    const [pendapatan, setPendapatan] = useState<Transaksi[]>([]);
    const [pengeluaran, setPengeluaran] = useState<Transaksi[]>([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await getKthProgramsAPI();
                setPrograms(res);
            } catch (err: any) {
                toast.error(err.message || 'Gagal memuat program');
            }
        };
        fetchPrograms();
    }, []);

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
            await createLaporanKeuanganAPI(payload);
            toast.success("Laporan keuangan berhasil dibuat dan dikirim!");
            navigate(-1);
        } catch (err: any) {
            toast.error(err.message || 'Gagal membuat laporan keuangan');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto pb-20 animate-in fade-in duration-300">
            <div className="flex flex-col gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors w-fit"
                >
                    <HiOutlineChevronLeft className="w-4 h-4 stroke-2" /> Kembali
                </button>
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Buat Laporan Keuangan</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 flex flex-col gap-8">
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Proyek</label>
                        <select 
                            value={programId}
                            onChange={(e) => setProgramId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] bg-white cursor-pointer shadow-sm"
                        >
                            <option value="">Pilih proyek</option>
                            {programs.map(p => (
                                <option key={p.id} value={p.id}>{p.nama_program || p.nama_program_investasi}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Periode</label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    value={periodeAwal}
                                    onChange={(e) => setPeriodeAwal(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] shadow-sm" 
                                />
                            </div>
                            <span className="text-gray-400 font-bold">-</span>
                            <div className="relative flex-1">
                                <input 
                                    type="date" 
                                    value={periodeAkhir}
                                    onChange={(e) => setPeriodeAkhir(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#185325] shadow-sm" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h2 className="text-sm font-bold text-gray-800">Transaksi Pendapatan</h2>
                    </div>
                    <button type="button" onClick={handleAddPendapatan} className="w-fit flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full hover:bg-emerald-100 transition-colors">
                        <HiPlus className="w-3.5 h-3.5" /> Tambah Pendapatan
                    </button>
                    {pendapatan.length > 0 && (
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="text-gray-500 font-bold border-b-2 border-gray-200">
                                    <tr>
                                        <th className="py-3 pr-4">Tanggal</th>
                                        <th className="py-3 px-4">Keterangan</th>
                                        <th className="py-3 px-4">Nominal</th>
                                        <th className="py-3 pl-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                                    {pendapatan.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 pr-4">
                                                <input type="date" value={item.tanggal} onChange={(e) => handleUpdatePendapatan(index, 'tanggal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input type="text" placeholder="Keterangan..." value={item.keterangan} onChange={(e) => handleUpdatePendapatan(index, 'keterangan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input type="number" placeholder="0" value={item.nominal || ''} onChange={(e) => handleUpdatePendapatan(index, 'nominal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 pl-4 text-center flex items-center justify-center gap-2">
                                                <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 rounded transition-colors" title="Upload Dokumen"><HiOutlineCloud className="w-5 h-5"/></button>
                                                <button type="button" onClick={() => handleRemovePendapatan(index)} className="p-1.5 text-gray-500 hover:text-red-600 rounded transition-colors" title="Hapus"><HiOutlineTrash className="w-5 h-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <h2 className="text-sm font-bold text-gray-800">Transaksi Pengeluaran</h2>
                    </div>
                    <button type="button" onClick={handleAddPengeluaran} className="w-fit flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full hover:bg-emerald-100 transition-colors">
                        <HiPlus className="w-3.5 h-3.5" /> Tambah Pengeluaran
                    </button>
                    {pengeluaran.length > 0 && (
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="text-gray-500 font-bold border-b-2 border-gray-200">
                                    <tr>
                                        <th className="py-3 pr-4">Tanggal</th>
                                        <th className="py-3 px-4">Keterangan</th>
                                        <th className="py-3 px-4">Nominal</th>
                                        <th className="py-3 pl-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                                    {pengeluaran.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 pr-4">
                                                <input type="date" value={item.tanggal} onChange={(e) => handleUpdatePengeluaran(index, 'tanggal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input type="text" placeholder="Keterangan..." value={item.keterangan} onChange={(e) => handleUpdatePengeluaran(index, 'keterangan', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 px-4">
                                                <input type="number" placeholder="0" value={item.nominal || ''} onChange={(e) => handleUpdatePengeluaran(index, 'nominal', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#185325]" />
                                            </td>
                                            <td className="py-3 pl-4 text-center flex items-center justify-center gap-2">
                                                <button type="button" className="p-1.5 text-gray-500 hover:text-blue-600 rounded transition-colors" title="Upload Dokumen"><HiOutlineCloud className="w-5 h-5"/></button>
                                                <button type="button" onClick={() => handleRemovePengeluaran(index)} className="p-1.5 text-gray-500 hover:text-red-600 rounded transition-colors" title="Hapus"><HiOutlineTrash className="w-5 h-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-[#EBF8F1] border border-[#C6EBD6] rounded-2xl p-6 mt-4 flex flex-col gap-2 shadow-sm text-sm font-bold text-gray-800">
                    <div className="grid grid-cols-[150px_10px_1fr] items-center"><span>Total Pendapatan</span><span>:</span><span>Rp {totalPendapatan.toLocaleString('id-ID')}</span></div>
                    <div className="grid grid-cols-[150px_10px_1fr] items-center"><span>Total Pengeluaran</span><span>:</span><span>Rp {totalPengeluaran.toLocaleString('id-ID')}</span></div>
                    <div className="grid grid-cols-[150px_10px_1fr] items-center mt-2 mb-2"><span>Laba Bersih</span><span>:</span><span>Rp {labaBersih.toLocaleString('id-ID')}</span></div>
                    
                    <div className="grid grid-cols-[150px_10px_1fr] items-center"><span>Hak KTH {persentaseKTH}%</span><span>:</span><span>Rp {hakKTH.toLocaleString('id-ID')}</span></div>
                    <div className="grid grid-cols-[150px_10px_1fr] items-center"><span>Hak Investor {persentaseInvestor}%</span><span>:</span><span>Rp {hakInvestor.toLocaleString('id-ID')}</span></div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <input
                        type="checkbox"
                        className="mt-1 appearance-none w-5 h-5 border-2 border-emerald-600 rounded bg-white checked:bg-emerald-600 checked:border-emerald-600 transition-colors cursor-pointer shrink-0 relative flex items-center justify-center after:content-[''] after:absolute after:hidden checked:after:block after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:mb-0.5"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                    />
                    <span className="text-sm font-bold text-gray-700 leading-relaxed">
                        Dengan ini saya menyatakan bahwa laporan dibuat dengan sebenar-benarnya
                    </span>
                </label>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isAgreed || isSubmitting}
                        className={`px-8 py-3 w-full text-white text-sm font-bold rounded-full transition-all shadow-sm ${
                            isAgreed && !isSubmitting
                                ? 'bg-[#185325] hover:bg-[#123d1c] cursor-pointer'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                    >
                        {isSubmitting ? 'Memproses...' : 'Buat Laporan Keuangan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLaporanKeuangan;