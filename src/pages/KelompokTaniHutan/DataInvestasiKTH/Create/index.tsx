import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft, HiCheck } from 'react-icons/hi2';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export interface InvestasiFormState {
    namaInvestasi: string;
    namaKTH: string;
    targetFunding: string;
    persentase: string;
    batasWaktu: string;
    deskripsi: string;
    coverFile?: File | null;
    milestones: { id: number; nama: string; batas: string; deskripsi: string }[];
    dokumen: { name: string; file: File | null; isRequired: boolean }[];
}

const steps = ['Informasi Investasi', 'Milestone', 'Dokumen', 'Review'];

const CreateInvestasi: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<InvestasiFormState>({
        namaInvestasi: '', 
        namaKTH: '', 
        targetFunding: '', 
        persentase: '', 
        batasWaktu: '', 
        deskripsi: '',
        coverFile: null,
        milestones: [],
        dokumen: [
            { name: 'Dokumen Perjanjian Investasi', file: null, isRequired: true },
            { name: 'Dokumen Rencana Bisnis', file: null, isRequired: true },
            { name: 'Template Perjanjian Investor', file: null, isRequired: true }
        ]
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setFormData(prev => ({ 
                    ...prev, 
                    namaKTH: parsedUser.nama_pengguna || parsedUser.nama || 'KTH Cikole Lestari' 
                }));
            } catch (e) {
                setFormData(prev => ({ ...prev, namaKTH: storedUser }));
            }
        } else {
            setFormData(prev => ({ ...prev, namaKTH: 'KTH Cikole Lestari' }));
        }
    }, []);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1)); 

    return (
        <div className="flex flex-col w-full mx-auto pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#185325] mb-6 cursor-pointer">
                <HiOutlineChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Kembali
            </button>

            <h1 className="text-xl font-bold text-center text-gray-800 uppercase tracking-wider mb-8">
                Pengajuan Investasi Produktif
            </h1>

            <div className="flex items-center justify-center mb-10 relative">
                <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-[#185325] transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
                {steps.map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;
                    return (
                        <div key={label} className="flex flex-col items-center flex-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${isActive || isCompleted ? 'bg-[#185325] border-[#185325] text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {isCompleted ? <HiCheck className="w-5 h-5" /> : stepNum}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center ${isActive || isCompleted ? 'text-[#185325]' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {currentStep === 1 && <Step1 data={formData} updateData={setFormData} onNext={nextStep} />}
            {currentStep === 2 && <Step2 data={formData} updateData={setFormData} onNext={nextStep} onPrev={prevStep} />}
            {currentStep === 3 && <Step3 data={formData} updateData={setFormData} onNext={nextStep} onPrev={prevStep} />}
            {currentStep === 4 && <Step4 data={formData} onNext={() => {}} onPrev={prevStep} />}
        </div>
    );
};

export default CreateInvestasi;