import React, { useState, useEffect } from 'react';
import { HiOutlineXMark, HiOutlineDocumentText, HiOutlineExclamationCircle, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProject: (projectId: number) => void;
}

const API_URL = "http://127.0.0.1:8000/api";

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectProject }) => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/projects`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const json = await res.json();
            const dataList = Array.isArray(json.payload) ? json.payload : (Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []));
            setProjects(dataList);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderStatus = (status: string) => {
        switch (status) {
            case 'completed':
                return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-bold"><HiOutlineCheckCircle /> Selesai</span>;
            case 'failed':
                return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold"><HiOutlineExclamationCircle /> Gagal</span>;
            case 'processing':
                return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md text-xs font-bold"><HiOutlineClock /> Diproses</span>;
            default:
                return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-md text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Riwayat Analisis CPI</h2>
                        <p className="text-sm text-gray-500 mt-1">Pilih riwayat untuk melihat ulang hasil analisis pada peta</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <HiOutlineXMark className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#185325] mb-3"></div>
                            <span className="text-gray-500 font-medium">Memuat riwayat...</span>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12">
                            <HiOutlineDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Belum ada riwayat analisis.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {projects.map((project) => (
                                <div key={project.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#185325]/30 hover:bg-green-50/10 transition-colors">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{project.nama_project || project.project_code}</h3>
                                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                                            <span>{new Date(project.created_at).toLocaleString('id-ID')}</span>
                                            {renderStatus(project.status)}
                                        </div>
                                    </div>
                                    <button
                                        disabled={project.status !== 'completed'}
                                        onClick={() => {
                                            onSelectProject(project.id);
                                            onClose();
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                                            project.status === 'completed' 
                                            ? 'bg-[#185325] text-white hover:bg-[#113d1b]' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Buka Peta
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;