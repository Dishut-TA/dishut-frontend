import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    HiOutlineCube,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineXCircle
} from 'react-icons/hi2';
import EvaluasiStatCard from './components/EvaluasiStatCard';
import PetaKegiatanEvaluasi from './components/PetaKegiatanEvaluasi';
import RingkasanStatus from './components/RingkasanStatus';

const DashboardEvaluasi: React.FC = () => {
    const [stats, setStats] = useState({
        total_target_bibit: 0,
        total_bibit_hidup: 0,
        rata_rata_persentase_tumbuh: 0,
        pu_gagal: 0
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/evaluasi/dashboard-stats')
            .then(res => {
                if (res.data?.data) {
                    setStats(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching evaluasi stats:", err));
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        Dashboard Evaluasi Penanaman
                    </h1>
                    <p className="text-sm text-gray-500">
                        Pantau ringkasan statistik dan sebaran hasil evaluasi keberhasilan tanam.
                    </p>
                </div>
            </div>
            
            {/* Stat Cards dengan Data Tersinkronisasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <EvaluasiStatCard
                    title="Total Target Bibit"
                    value={stats.total_target_bibit.toLocaleString('id-ID')}
                    icon={<HiOutlineCube className="w-6 h-6" />}
                    theme="blue"
                />
                <EvaluasiStatCard
                    title="Total Bibit Hidup"
                    value={stats.total_bibit_hidup.toLocaleString('id-ID')}
                    icon={<HiOutlineCheckCircle className="w-6 h-6" />}
                    theme="green"
                />
                <EvaluasiStatCard
                    title="Rata-Rata Persentase Tumbuh"
                    value={`${stats.rata_rata_persentase_tumbuh}%`}
                    icon={<HiOutlineExclamationTriangle className="w-6 h-6" />}
                    theme="indigo"
                />
                <EvaluasiStatCard
                    title="Petak Ukur (PU) Gagal"
                    value={`${stats.pu_gagal} PU`}
                    icon={<HiOutlineXCircle className="w-6 h-6" />}
                    theme="red"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <PetaKegiatanEvaluasi />
                <RingkasanStatus />
            </div>

        </div>
    );
};

export default DashboardEvaluasi;