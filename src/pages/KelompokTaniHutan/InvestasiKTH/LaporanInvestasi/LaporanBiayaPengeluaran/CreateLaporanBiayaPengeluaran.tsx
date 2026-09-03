import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPlus, HiXMark } from 'react-icons/hi2';
import { HiOutlineArrowUpTray } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CreateLaporanBiayaPengeluaran = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [formData, setFormData] = useState({
        investasiId: '',
        biayaPengeluaran: '',
        buktiLaporan: null as File | null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        
        if (type === 'file') {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files ? fileInput.files[0] : null;
            setFormData(prev => ({ ...prev, [name]: file }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleConfirmSubmit = () => {
        setShowModal(false);
        // Simulasi integrasi API
        toast.success("Laporan biaya pengeluaran berhasil dibuat");
        navigate(-1);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-sm font-bold text-[#185325] self-start hover:underline"
            >
                <HiOutlineChevronLeft className="stroke-2" /> Kembali
            </button>
            <div className="p-8 md:p-12">
                <h1 className="text-xl font-bold text-center text-gray-800 mb-10">Buat Laporan Biaya Pengeluaran</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Investasi</label>
                        <select
                            name="investasiId"
                            value={formData.investasiId}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] bg-white cursor-pointer appearance-none shadow-sm"
                        >
                            <option value="" disabled>Pilih investasi</option>
                            <option value="1">Investasi Ekowisata Kebun Stroberi</option>
                            <option value="2">Investasi Wisata Dieng</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Biaya Pengeluaran</label>
                        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-[#185325]/20 focus-within:border-[#185325] transition-all shadow-sm">
                            <span className="pl-5 pr-2 text-sm font-bold text-gray-600 bg-gray-50/50 py-3.5">Rp.</span>
                            <input
                                type="number"
                                name="biayaPengeluaran"
                                placeholder="0"
                                value={formData.biayaPengeluaran}
                                onChange={handleInputChange}
                                required
                                className="w-full px-2 py-3.5 text-sm outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Bukti Laporan Pengeluaran</label>
                        <div className="relative">
                            <input
                                type="file"
                                name="buktiLaporan"
                                id="buktiLaporan"
                                onChange={handleInputChange}
                                required
                                className="hidden"
                            />
                            <label
                                htmlFor="buktiLaporan"
                                className="flex items-center justify-between w-full px-5 py-3.5 border border-gray-300 rounded-full text-sm text-gray-400 cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-[#185325]/20 focus-within:border-[#185325] transition-all shadow-sm"
                            >
                                <span className={`truncate ${formData.buktiLaporan ? 'text-gray-700 font-medium' : ''}`}>
                                    {formData.buktiLaporan ? formData.buktiLaporan.name : 'Upload File'}
                                </span>
                                <HiOutlineArrowUpTray className="w-5 h-5 text-gray-500 shrink-0" />
                            </label>
                        </div>
                    </div>

                    <div className="pt-6">
                        <label className="flex items-start gap-3 cursor-pointer group mb-6">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#185325] checked:border-[#185325] transition-colors cursor-pointer"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                />
                                <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                                Dengan ini saya menyatakan bahwa laporan dibuat dengan sebenar-benarnya tanpa ada paksaan dari pihak manapun.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={!isAgreed}
                            className={`flex items-center justify-center gap-2 w-full py-4 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-lg ${
                                isAgreed
                                    ? 'bg-[#185325] hover:bg-[#123d1c] active:scale-95'
                                    : 'bg-[#9CA3AF] cursor-not-allowed'
                            }`}
                        >
                            Buat Laporan Pengeluaran <HiPlus className="w-5 h-5 stroke-2" />
                        </button>
                    </div>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-opacity animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg rounded-4xl bg-[#F8FAF8] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-200/50 transition-colors"
                        >
                            <HiXMark className="w-6 h-6 text-gray-500" />
                        </button>

                        <div className="text-center">
                            <h2 className="mb-4 text-xl font-bold text-[#185325]">
                                Buat Laporan Biaya Pengeluaran
                            </h2>

                            <p className="mb-10 text-sm leading-relaxed text-gray-600 px-2">
                                Pastikan bahwa data yang telah Anda inputkan sudah benar dan sesuai. Karena laporan yang telah dibuat tidak dapat diubah kembali.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 rounded-full border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                                >
                                    Periksa Kembali
                                </button>

                                <button
                                    onClick={handleConfirmSubmit}
                                    className="flex-1 rounded-full bg-[#185325] py-3.5 text-sm font-bold text-white transition hover:bg-[#15461f] shadow-md active:scale-95"
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
};

export default CreateLaporanBiayaPengeluaran;