import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiPlus, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';

const CreateLaporanUsaha = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-[#185325] self-start">
                <HiOutlineChevronLeft /> Kembali
            </button>

            <div className="p-8 md:p-10">
                <h1 className="text-xl font-bold text-center text-gray-800 mb-8">Buat Laporan Usaha</h1>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowModal(true); }}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Investasi</label>
                        <select
                            defaultValue=""
                            className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#185325] focus:border-[#185325] bg-white cursor-pointer appearance-none"
                        >
                            <option value="" disabled>Pilih investasi</option>
                            <option value="1">Investasi Ekowisata Kebun Stroberi</option>
                            <option value="2">Investasi Wisata Dieng</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Dana Terpakai</label>
                        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325] transition-all">
                            <span className="pl-4 pr-2 text-sm font-bold text-gray-600 bg-gray-50/50 py-3">Rp.</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-2 py-3 text-sm outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Sisa Dana</label>
                        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325] transition-all">
                            <span className="pl-4 pr-2 text-sm font-bold text-gray-600 bg-gray-50/50 py-3">Rp.</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-2 py-3 text-sm outline-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Jumlah Investor</label>
                        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325] transition-all">
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-2 py-3 text-sm outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Dana Investasi</label>
                        <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-[#185325] focus-within:ring-1 focus-within:ring-[#185325] transition-all">
                            <span className="pl-4 pr-2 text-sm font-bold text-gray-600 bg-gray-50/50 py-3">Rp.</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-2 py-3 text-sm outline-none bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <label className="flex items-start gap-3 cursor-pointer group mb-5">
                            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-4.5 h-4.5 border-2 border-gray-300 rounded checked:bg-[#185325] checked:border-[#185325] transition-colors cursor-pointer"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-[11px] sm:text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                                Dengan ini saya menyatakan bahwa laporan dibuat dengan sebenar-benarnya
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={!isAgreed}
                            className={`flex items-center justify-center gap-1 w-full py-3.5 text-white text-sm font-bold rounded-full transition-all duration-300 shadow-sm ${isAgreed
                                ? 'bg-[#185325] hover:bg-[#123d1c]'
                                : 'bg-[#9CA3AF] cursor-not-allowed opacity-80'
                                }`}
                        >
                            Buat Laporan Usaha <HiPlus className="w-4 h-4 stroke-2" />
                        </button>
                    </div>
                </form>
            </div>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity duration-300"
                >
                    <div
                        className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100"
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <HiXMark className="w-6 h-6 text-gray-500" />
                        </button>

                        <h2 className="mb-4 text-center text-xl font-bold text-[#185325]">
                            Buat Laporan Usaha
                        </h2>

                        <p className="mb-8 text-center text-sm leading-6 text-gray-600">
                            Pastikan bahwa data yang telah Anda inputkan sudah benar dan sesuai.
                            Karena laporan yang telah dibuat tidak dapat diubah kembali.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 rounded-full border border-gray-300 py-3 font-medium transition hover:bg-gray-50"
                            >
                                Periksa Kembali
                            </button>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    toast.success("Laporan dibuat");
                                    navigate(-1);
                                }}
                                className="flex-1 rounded-full bg-[#185325] py-3 font-medium text-white transition hover:bg-[#15461f] active:scale-95"
                            >
                                Buat Laporan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateLaporanUsaha;