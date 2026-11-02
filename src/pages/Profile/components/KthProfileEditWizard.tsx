import React, { useState, useRef } from 'react';
import { HiOutlinePencil } from 'react-icons/hi2';
import {
  type KthFormData,
  CDK_OPTIONS,
  JENIS_USAHA_OPTIONS,
  KELAS_KTH_OPTIONS,
  BANK_OPTIONS,
} from '../types';
import KthProfileStepper from './KthProfileStepper';
import KthFormInput from './KthFormInput';
import KthFormSelect from './KthFormSelect';
import { ToastError } from '@/utils/toastHelper';

interface KthProfileEditWizardProps {
  initialData: KthFormData;
  photoUrl: string;
  onCancel: () => void;
  onSubmit: (data: KthFormData, newPhotoFile: File | null) => Promise<void>;
  isSubmitting?: boolean;
}

export const KthProfileEditWizard: React.FC<KthProfileEditWizardProps> = ({
  initialData,
  photoUrl,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<KthFormData>({ ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof KthFormData, string>>>({});

  // Photo change state
  const [photoPreview, setPhotoPreview] = useState<string>(photoUrl);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof KthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        ToastError('Hanya file gambar yang diperbolehkan!');
        return;
      }
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof KthFormData, string>> = {};
    if (!formData.cdk.trim()) newErrors.cdk = 'Cabang Dinas Kehutanan wajib dipilih';
    if (!formData.kabupaten_kota.trim()) newErrors.kabupaten_kota = 'Kabupaten / Kota wajib diisi';
    if (!formData.kecamatan.trim()) newErrors.kecamatan = 'Kecamatan wajib diisi';
    if (!formData.desa_kelurahan.trim()) newErrors.desa_kelurahan = 'Desa / Kelurahan wajib diisi';
    if (!formData.nomor_sk.trim()) newErrors.nomor_sk = 'Nomor SK / Register KTH wajib diisi';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      ToastError('Mohon lengkapi field yang bertanda *');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof KthFormData, string>> = {};
    if (!formData.nama_kelompok.trim()) newErrors.nama_kelompok = 'Nama Kelompok wajib diisi';
    if (!formData.nama_ketua.trim()) newErrors.nama_ketua = 'Nama Lengkap Ketua KTH wajib diisi';
    if (!formData.no_wa_ketua.trim()) newErrors.no_wa_ketua = 'No. WhatsApp Ketua wajib diisi';
    if (!formData.jumlah_anggota.trim()) newErrors.jumlah_anggota = 'Jumlah Anggota wajib diisi';
    if (!formData.jenis_usaha.trim()) newErrors.jenis_usaha = 'Jenis Usaha Utama wajib dipilih';
    if (!formData.alamat_sekretariat.trim()) newErrors.alamat_sekretariat = 'Alamat Lengkap Sekretariat wajib diisi';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      ToastError('Mohon lengkapi field yang bertanda *');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof KthFormData, string>> = {};
    if (!formData.nama_bank.trim()) newErrors.nama_bank = 'Nama Bank wajib dipilih';
    if (!formData.nomor_rekening.trim()) newErrors.nomor_rekening = 'Nomor Rekening Bank wajib diisi';
    if (!formData.nama_pemilik_rekening.trim()) newErrors.nama_pemilik_rekening = 'Nama Pemilik Rekening wajib diisi';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      ToastError('Mohon lengkapi field yang bertanda *');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      await onSubmit(formData, photoFile);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 sm:px-6">
      {/* Top Center: Circular Avatar & Edit Photo Button */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative group">
          <img
            src={photoPreview}
            alt="Avatar"
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-sm border border-gray-100 bg-[#E8EFE9]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                formData.nama_ketua || formData.nama_kelompok || 'KTH'
              )}&background=D5F0DE&color=185325&size=200&bold=true`;
            }}
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        <button
          type="button"
          onClick={handlePhotoClick}
          className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#185325] hover:text-[#0e3316] transition-colors cursor-pointer"
        >
          <HiOutlinePencil className="w-3.5 h-3.5 stroke-2" />
          <span>Ganti foto profile</span>
        </button>
      </div>

      {/* Stepper Indicator */}
      <KthProfileStepper
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />

      {/* Stepper Forms */}
      <form onSubmit={handleFinalSubmit} className="mt-8 space-y-4">
        {/* ================= STEP 1 ================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <KthFormSelect
              label="Cabang Dinas Kehutanan"
              required
              options={CDK_OPTIONS}
              value={formData.cdk}
              error={errors.cdk}
              placeholder="Cabang Dinas Kehutanan (CDK) 1"
              onChange={(e) => handleInputChange('cdk', e.target.value)}
            />

            <KthFormInput
              label="Kabupaten / Kota"
              required
              value={formData.kabupaten_kota}
              error={errors.kabupaten_kota}
              placeholder="Kab. Bandung"
              onChange={(e) => handleInputChange('kabupaten_kota', e.target.value)}
            />

            <KthFormInput
              label="Kecamatan"
              required
              value={formData.kecamatan}
              error={errors.kecamatan}
              placeholder="Kecamatan"
              onChange={(e) => handleInputChange('kecamatan', e.target.value)}
            />

            <KthFormInput
              label="Desa / Kelurahan"
              required
              value={formData.desa_kelurahan}
              error={errors.desa_kelurahan}
              placeholder="Desa / Kelurahan"
              onChange={(e) => handleInputChange('desa_kelurahan', e.target.value)}
            />

            <KthFormInput
              label="Nomor SK / Register KTH"
              required
              value={formData.nomor_sk}
              error={errors.nomor_sk}
              placeholder="Nomor SK ada di surat pengukuhan KTH"
              onChange={(e) => handleInputChange('nomor_sk', e.target.value)}
            />

            {/* Step 1 Actions */}
            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[#185325] hover:bg-[#12421c] text-white font-semibold text-sm py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                Selanjutnya
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2 transition-colors cursor-pointer"
              >
                Kembali ke Profil
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <KthFormInput
              label="Nama Kelompok"
              required
              value={formData.nama_kelompok}
              error={errors.nama_kelompok}
              placeholder="KTH Rimba Nusantara"
              onChange={(e) => handleInputChange('nama_kelompok', e.target.value)}
            />

            <KthFormInput
              label="Nama Lengkap Ketua KTH"
              required
              value={formData.nama_ketua}
              error={errors.nama_ketua}
              placeholder="Asep Romli"
              onChange={(e) => handleInputChange('nama_ketua', e.target.value)}
            />

            {/* 2 Columns: No WhatsApp & Jumlah Anggota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KthFormInput
                label="No. WhatsApp Ketua"
                required
                value={formData.no_wa_ketua}
                error={errors.no_wa_ketua}
                placeholder="089786543234"
                onChange={(e) => handleInputChange('no_wa_ketua', e.target.value)}
              />
              <KthFormInput
                label="Jumlah Anggota (Orang)"
                required
                value={formData.jumlah_anggota}
                error={errors.jumlah_anggota}
                placeholder="10 Orang"
                onChange={(e) => handleInputChange('jumlah_anggota', e.target.value)}
              />
            </div>

            <KthFormSelect
              label="Jenis Usaha Utama"
              required
              options={JENIS_USAHA_OPTIONS}
              value={formData.jenis_usaha}
              error={errors.jenis_usaha}
              placeholder="Jenis usaha"
              onChange={(e) => handleInputChange('jenis_usaha', e.target.value)}
            />

            <KthFormSelect
              label="Kelas KTH"
              options={KELAS_KTH_OPTIONS}
              value={formData.kelas_kth}
              placeholder="Kelas KTH"
              onChange={(e) => handleInputChange('kelas_kth', e.target.value)}
            />

            <KthFormInput
              label="Alamat Lengkap Sekretariat"
              required
              value={formData.alamat_sekretariat}
              error={errors.alamat_sekretariat}
              placeholder="Jl. Sekeloa Tengah No. 27"
              onChange={(e) => handleInputChange('alamat_sekretariat', e.target.value)}
            />

            {/* Step 2 Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-[#8E9093] hover:bg-[#7b7d80] text-white font-semibold text-sm py-3.5 px-8 sm:px-12 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 bg-[#185325] hover:bg-[#12421c] text-white font-semibold text-sm py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <KthFormSelect
              label="Nama Bank"
              required
              options={BANK_OPTIONS}
              value={formData.nama_bank}
              error={errors.nama_bank}
              placeholder="Bank Rakyat Indonesia (BRI)"
              onChange={(e) => handleInputChange('nama_bank', e.target.value)}
            />

            <KthFormInput
              label="Nomor Rekening Bank"
              required
              value={formData.nomor_rekening}
              error={errors.nomor_rekening}
              placeholder="Nomor Rekening Bank"
              onChange={(e) => handleInputChange('nomor_rekening', e.target.value)}
            />

            <KthFormInput
              label="Nama Pemilik Rekening"
              required
              value={formData.nama_pemilik_rekening}
              error={errors.nama_pemilik_rekening}
              placeholder="Nama Pemilik Rekening"
              onChange={(e) => handleInputChange('nama_pemilik_rekening', e.target.value)}
            />

            {/* Step 3 Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="bg-[#8E9093] hover:bg-[#7b7d80] text-white font-semibold text-sm py-3.5 px-8 sm:px-12 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#185325] hover:bg-[#12421c] text-white font-semibold text-sm py-3.5 px-6 rounded-full transition-all duration-200 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default KthProfileEditWizard;
