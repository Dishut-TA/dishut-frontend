import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiOutlineFunnel, HiOutlinePrinter } from 'react-icons/hi2';

export default function BiayaPemasukanIndex() {
    const navigate = useNavigate();
    const [pemasukanList] = useState([
        {
            id: 1,
            tanggal: '24/08/2025',
            investasi: 'Investasi Ekowisata Kebun Stroberi',
            biayaPendapatan: 'Rp 5.000.000',
            dokumen: 'Pendapatan.pdf'
        }
    ]);

    return (
        <div className="w-full min-h-screen bg-[#F8FAF8] text-gray-800 font-sans">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        Biaya Pemasukan
                    </h1>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button 
                            onClick={() => navigate('/admin/kth/laporan-investasi/pemasukan/create')}
                            className="flex items-center gap-2 bg-[#185325] hover:bg-[#123d1c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
                        >
                            <HiPlus className="w-4 h-4 stroke-2" /> Buat Laporan Pemasukan
                        </button>

                        <button className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors">
                            <HiOutlineFunnel className="w-4 h-4 text-gray-500" /> Filter
                        </button>

                        <button className="flex items-center gap-2 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors">
                            <HiOutlinePrinter className="w-4 h-4 text-gray-500" /> Print
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#D1EFE0]/50 text-gray-700 text-xs font-bold border-b border-gray-100">
                                    <th className="py-4 px-6 text-center w-16">No</th>
                                    <th className="py-4 px-6">Tanggal</th>
                                    <th className="py-4 px-6">Investasi</th>
                                    <th className="py-4 px-6">Biaya Pendapatan</th>
                                    <th className="py-4 px-6">Dokumen</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs sm:text-sm text-gray-700 divide-y divide-gray-100/70">
                                {pemasukanList.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50/40 transition-colors bg-white">
                                        <td className="py-4 px-6 text-center font-medium text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-gray-600">
                                            {item.tanggal}
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-800">
                                            {item.investasi}
                                        </td>
                                        <td className="py-4 px-6 font-medium">
                                            {item.biayaPendapatan}
                                        </td>
                                        <td className="py-4 px-6 font-medium">
                                            <a href="#" className="text-gray-800 hover:text-[#185325] hover:underline transition-colors">
                                                {item.dokumen}
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}