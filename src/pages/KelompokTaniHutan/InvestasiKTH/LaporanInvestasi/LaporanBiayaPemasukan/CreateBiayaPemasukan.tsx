import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiXMark, HiOutlineChevronLeft, HiOutlineArrowUpTray } from 'react-icons/hi2';

export default function BiayaPemasukanCreate() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        investasiId: '',
        biayaPemasukan: '',
        dokumenPemasukan: null as File | null
    });

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true); 
    };

    const handleConfirmSubmit = () => {
        setShowModal(false);
        // TODO: Panggil API submit di sini
        alert("Laporan biaya pemasukan berhasil dibuat!");
        
        // Reset form & kembali ke index
        setForm({ investasiId: '', biayaPemasukan: '', dokumenPemasukan: null });
        navigate('/biaya-pemasukan'); 
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAF8] p-6 text-gray-800 font-sans">
            <div className="max-w-xl mx-auto flex flex-col gap-4 pb-12 pt-4">
                <button 
                    onClick={() => navigate('/biaya-pemasukan')} 
                    className="flex items-center gap-2 text-xs font-bold text-[#185325] self-start hover:underline bg-transparent border-0 outline-none"
                >
                    <HiOutlineChevronLeft className="stroke-2 w-4 h-4" /> Kembali
                </button>
                <div className="p-8 md:p-10">
                    <h1 className="text-lg font-bold text-center text-gray-800 mb-8">
                        Buat Laporan Biaya Pemasukan
                    </h1>
                    
                    <form className="space-y-5" onSubmit={handleSubmitForm}>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">
                                Investasi
                            </label>
                            <select 
                                required 
                                className="w-full px-5 py-3 border border-gray-300 rounded-full text-xs text-gray-700 bg-white shadow-sm focus:outline-none focus:border-[#185325]" 
                                value={form.investasiId} 
                                onChange={e => setForm({...form, investasiId: e.target.value})}
                            >
                                <option value="" disabled>Pilih investasi</option>
                                <option value="1">Investasi Ekowisata Kebun Stroberi</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">
                                Biaya Pemasukan
                            </label>
                            <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] shadow-sm bg-white">
                                <span className="pl-5 pr-2 text-xs font-bold text-gray-400">Rp.</span>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    required 
                                    className="w-full px-1 py-3 text-xs outline-none bg-transparent" 
                                    value={form.biayaPemasukan} 
                                    onChange={e => setForm({...form, biayaPemasukan: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1.5 ml-1">
                                Dokumen Pemasukan
                            </label>
                            <input 
                                type="file" 
                                id="dokumen-pemasukan-file" 
                                className="hidden" 
                                onChange={e => setForm({...form, dokumenPemasukan: e.target.files ? e.target.files[0] : null})}
                            />
                            <label 
                                htmlFor="dokumen-pemasukan-file" 
                                className="flex items-center justify-between w-full px-5 py-3 border border-gray-300 rounded-full text-xs text-gray-400 cursor-pointer bg-white shadow-sm hover:border-gray-400 transition-colors"
                            >
                                <span className="truncate text-gray-600">
                                    {form.dokumenPemasukan ? form.dokumenPemasukan.name : 'Upload file'}
                                </span>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-500">
                                    <HiOutlineArrowUpTray className="w-3 h-3 stroke-[2.5]" />
                                </div>
                            </label>
                            <p className="text-[10px] text-gray-500 italic mt-2 ml-1">
                                **Jika ada 2 file atau lebih, mohon digabungkan dalam satu file
                            </p>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="w-full py-3.5 bg-[#185325] hover:bg-[#123d1c] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                            >
                                Buat Laporan Pemasukan <HiPlus className="w-4 h-4 stroke-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4">
                    <div className="relative w-full max-w-sm rounded-[28px] bg-[#F8FAF8] p-7 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200/50 transition-colors outline-none border-0"
                        >
                            <HiXMark className="w-5 h-5 text-gray-400" />
                        </button>

                        <div className="text-center pt-3">
                            <h2 className="mb-3 text-sm font-bold text-[#185325]">
                                Buat Laporan Biaya Pemasukan
                            </h2>
                            <p className="mb-8 text-[11px] leading-relaxed text-gray-500 px-2">
                                Pastikan bahwa data yang telah Anda inputkan sudah benar dan sesuai. Karena laporan yang telah dibuat tidak bisa diubah kembali
                            </p>
                            <div className="flex gap-2.5">
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Periksa Kembali
                                </button>
                                <button 
                                    onClick={handleConfirmSubmit} 
                                    className="flex-1 rounded-full bg-[#185325] py-2.5 text-xs font-bold text-white hover:bg-[#15461f] shadow-sm transition-colors"
                                >
                                    Buat Laporan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}