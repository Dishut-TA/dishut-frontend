import React, { useState, useRef, useEffect } from 'react';
import { HiXMark, HiOutlineDocumentArrowUp, HiOutlineDocumentText, HiChevronDown } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { createKthAPI, updateKthAPI, importKthExcelAPI, type KthResponseData, type KthPayload } from '@/services/kth.service';

interface ModalInputKTHProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  kthToEdit?: KthResponseData | null;
}

interface WilayahOption {
  id: string;
  name: string;
}

const WILAYAH_API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

const FALLBACK_JABAR_KABUPATEN: WilayahOption[] = [
  { id: '3201', name: 'Kabupaten Bogor' },
  { id: '3202', name: 'Kabupaten Sukabumi' },
  { id: '3203', name: 'Kabupaten Cianjur' },
  { id: '3204', name: 'Kabupaten Bandung' },
  { id: '3205', name: 'Kabupaten Garut' },
  { id: '3206', name: 'Kabupaten Tasikmalaya' },
  { id: '3207', name: 'Kabupaten Ciamis' },
  { id: '3208', name: 'Kabupaten Kuningan' },
  { id: '3209', name: 'Kabupaten Cirebon' },
  { id: '3210', name: 'Kabupaten Majalengka' },
  { id: '3211', name: 'Kabupaten Sumedang' },
  { id: '3212', name: 'Kabupaten Indramayu' },
  { id: '3213', name: 'Kabupaten Subang' },
  { id: '3214', name: 'Kabupaten Purwakarta' },
  { id: '3215', name: 'Kabupaten Karawang' },
  { id: '3216', name: 'Kabupaten Bekasi' },
  { id: '3217', name: 'Kabupaten Bandung Barat' },
  { id: '3218', name: 'Kabupaten Pangandaran' },
  { id: '3271', name: 'Kota Bogor' },
  { id: '3272', name: 'Kota Sukabumi' },
  { id: '3273', name: 'Kota Bandung' },
  { id: '3274', name: 'Kota Cirebon' },
  { id: '3275', name: 'Kota Bekasi' },
  { id: '3276', name: 'Kota Depok' },
  { id: '3277', name: 'Kota Cimahi' },
  { id: '3278', name: 'Kota Tasikmalaya' },
  { id: '3279', name: 'Kota Banjar' },
];

const CDK_OPTIONS = [
  'CDK WILAYAH I',
  'CDK WILAYAH II',
  'CDK WILAYAH III',
  'CDK WILAYAH IV',
  'CDK WILAYAH V',
  'CDK WILAYAH VI',
  'CDK WILAYAH VII',
  'CDK WILAYAH VIII',
  'CDK WILAYAH IX',
];

const JENIS_USAHA_OPTIONS = [
  'Agroforestri',
  'Silvopastura',
  'Silvofishery',
  'Hasil Hutan Bukan Kayu (HHBK)',
  'Jasa Lingkungan / Ekowisata',
  'Usaha Kayu Rakyat',
  'Budidaya Madu',
  'Pengolahan Hasil Hutan',
  'Lainnya',
];

const BANK_OPTIONS = [
  'BRI',
  'BNI',
  'Mandiri',
  'BCA',
  'BJB',
  'BSI',
  'BTN',
  'CIMB Niaga',
  'Danamon',
  'Permata',
];

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ''))
    .join(' ');

const normalizeRegionName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\bkab\.\s*/g, 'kabupaten ')
    .replace(/\s+/g, ' ')
    .trim();

const initialFormState = {
  cdk: '',
  kabupaten_kota: '',
  kecamatan: '',
  desa_kelurahan: '',
  nomor_sk: '',
  nama: '',
  ketua: '',
  no_wa_ketua: '',
  jumlah_anggota: '',
  jenis_usaha: '',
  kelas_kth: '',
  alamat_sekretariat: '',
  nama_bank: 'BRI',
  nomor_rekening: '',
  nama_pemilik_rekening: '',
};

const ModalInputKTH: React.FC<ModalInputKTHProps> = ({ isOpen, onClose, onSuccess, kthToEdit }) => {
  const isEditMode = Boolean(kthToEdit);
  const [inputMode, setInputMode] = useState<'excel' | 'manual'>('excel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(initialFormState);

  // Cascading wilayah states (Jawa Barat - Province ID 32)
  const [kabupatenList, setKabupatenList] = useState<WilayahOption[]>(FALLBACK_JABAR_KABUPATEN);
  const [kecamatanList, setKecamatanList] = useState<WilayahOption[]>([]);
  const [desaList, setDesaList] = useState<WilayahOption[]>([]);
  const [selectedKabId, setSelectedKabId] = useState('');
  const [selectedKecId, setSelectedKecId] = useState('');
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingDesa, setLoadingDesa] = useState(false);

  // Fetch Kabupaten/Kota Jawa Barat on modal open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetch(`${WILAYAH_API_BASE}/regencies/32.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WilayahOption[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setKabupatenList(
            data.map((item) => ({
              id: item.id,
              name: toTitleCase(item.name),
            }))
          );
        }
      })
      .catch(() => {
        // Keep fallback list
      });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Fetch Kecamatan when Kabupaten/Kota ID changes
  useEffect(() => {
    if (!selectedKabId) {
      setKecamatanList([]);
      return;
    }
    let isMounted = true;
    setLoadingKecamatan(true);
    fetch(`${WILAYAH_API_BASE}/districts/${selectedKabId}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WilayahOption[]) => {
        if (isMounted && Array.isArray(data)) {
          const formatted = data.map((item) => ({
            id: item.id,
            name: toTitleCase(item.name),
          }));
          setKecamatanList(formatted);
          // Auto-match existing kecamatan in edit mode
          if (formData.kecamatan) {
            const matched = formatted.find(
              (k) => normalizeRegionName(k.name) === normalizeRegionName(formData.kecamatan)
            );
            if (matched) setSelectedKecId(matched.id);
          }
        }
      })
      .catch(() => {
        if (isMounted) setKecamatanList([]);
      })
      .finally(() => {
        if (isMounted) setLoadingKecamatan(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedKabId]);

  // Fetch Desa/Kelurahan when Kecamatan ID changes
  useEffect(() => {
    if (!selectedKecId) {
      setDesaList([]);
      return;
    }
    let isMounted = true;
    setLoadingDesa(true);
    fetch(`${WILAYAH_API_BASE}/villages/${selectedKecId}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: WilayahOption[]) => {
        if (isMounted && Array.isArray(data)) {
          setDesaList(
            data.map((item) => ({
              id: item.id,
              name: toTitleCase(item.name),
            }))
          );
        }
      })
      .catch(() => {
        if (isMounted) setDesaList([]);
      })
      .finally(() => {
        if (isMounted) setLoadingDesa(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedKecId]);

  // Sync form state on open or kthToEdit change
  useEffect(() => {
    if (kthToEdit) {
      setInputMode('manual');
      const kabName = kthToEdit.kabupaten_kota || '';
      setFormData({
        cdk: kthToEdit.cdk || '',
        kabupaten_kota: kabName,
        kecamatan: kthToEdit.kecamatan || '',
        desa_kelurahan: kthToEdit.desa_kelurahan || '',
        nomor_sk: kthToEdit.nomor_sk || kthToEdit.no_sk || '',
        nama: kthToEdit.nama || '',
        ketua: kthToEdit.ketua || '',
        no_wa_ketua: kthToEdit.no_wa_ketua || kthToEdit.no_wa || '',
        jumlah_anggota:
          kthToEdit.jumlah_anggota !== undefined && kthToEdit.jumlah_anggota !== null
            ? String(kthToEdit.jumlah_anggota)
            : '',
        jenis_usaha: kthToEdit.jenis_usaha || '',
        kelas_kth: kthToEdit.kelas_kth || '',
        alamat_sekretariat: kthToEdit.alamat_sekretariat || kthToEdit.alamat || '',
        nama_bank: kthToEdit.nama_bank || 'BRI',
        nomor_rekening: kthToEdit.nomor_rekening || (kthToEdit as any).no_rekening || '',
        nama_pemilik_rekening: kthToEdit.nama_pemilik_rekening || '',
      });
      const matchedKab = kabupatenList.find(
        (k) => normalizeRegionName(k.name) === normalizeRegionName(kabName)
      );
      setSelectedKabId(matchedKab ? matchedKab.id : '');
      setSelectedKecId('');
    } else {
      setInputMode('excel');
      setFormData(initialFormState);
      setSelectedKabId('');
      setSelectedKecId('');
      setKecamatanList([]);
      setDesaList([]);
      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [kthToEdit, isOpen]);

  if (!isOpen) return null;

  const isManualActive = isEditMode || inputMode === 'manual';
  const fieldTabIndex = isManualActive ? 0 : -1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKabupatenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const matched = kabupatenList.find((k) => k.name === value);
    setSelectedKabId(matched ? matched.id : '');
    setSelectedKecId('');
    setKecamatanList([]);
    setDesaList([]);
    setFormData((prev) => ({
      ...prev,
      kabupaten_kota: value,
      kecamatan: '',
      desa_kelurahan: '',
    }));
  };

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const matched = kecamatanList.find((k) => k.name === value);
    setSelectedKecId(matched ? matched.id : '');
    setDesaList([]);
    setFormData((prev) => ({
      ...prev,
      kecamatan: value,
      desa_kelurahan: '',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  const buildPayload = (): KthPayload => ({
    cdk: formData.cdk,
    kabupaten_kota: formData.kabupaten_kota,
    kecamatan: formData.kecamatan,
    desa_kelurahan: formData.desa_kelurahan,
    nomor_sk: formData.nomor_sk || undefined,
    nama: formData.nama,
    ketua: formData.ketua,
    no_wa_ketua: formData.no_wa_ketua || undefined,
    jumlah_anggota: formData.jumlah_anggota ? Number(formData.jumlah_anggota) : undefined,
    jenis_usaha: formData.jenis_usaha,
    kelas_kth: formData.kelas_kth || undefined,
    alamat_sekretariat: formData.alamat_sekretariat || undefined,
    nama_bank: formData.nama_bank || undefined,
    nomor_rekening: formData.nomor_rekening || undefined,
    nama_pemilik_rekening: formData.nama_pemilik_rekening || undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditMode ? 'Memperbarui data KTH...' : 'Memproses data KTH...');

    try {
      if (isEditMode && kthToEdit) {
        if (!formData.cdk || !formData.nama || !formData.ketua) {
          throw new Error('Mohon lengkapi field wajib pada form!');
        }
        await updateKthAPI(kthToEdit.id, buildPayload());
        toast.success('Data KTH berhasil diperbarui!', { id: loadingToast });
      } else if (inputMode === 'excel') {
        if (!excelFile) throw new Error('Pilih file Excel terlebih dahulu!');
        await importKthExcelAPI(excelFile);
        toast.success('Data KTH berhasil diimpor dari Excel!', { id: loadingToast });
      } else {
        if (!formData.cdk || !formData.nama || !formData.ketua) {
          throw new Error('Mohon lengkapi field wajib pada form!');
        }
        await createKthAPI(buildPayload());
        toast.success('Data KTH berhasil ditambahkan!', { id: loadingToast });
      }

      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFormData(initialFormState);
      setSelectedKabId('');
      setSelectedKecId('');
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat memproses data.';

      toast.error(errorMessage, {
        id: loadingToast,
        style: {
          whiteSpace: 'pre-line',
          textAlign: 'left',
        },
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all';
  const selectClass =
    'w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#185325]/20 focus:border-[#185325] transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed';
  const labelClass = 'block text-xs font-bold text-gray-800 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {isEditMode ? 'Edit Data KTH' : 'Input Data KTH'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditMode ? 'Perbarui informasi kelompok tani hutan.' : 'Pilih metode pengisian data yang diinginkan.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-700 text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 cursor-pointer"
          >
            <HiXMark className="w-4 h-4 stroke-2" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {!isEditMode && (
            <div className="relative flex bg-gray-100/80 p-1.5 rounded-full mb-6 shadow-inner">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#185325] shadow-md rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  inputMode === 'excel' ? 'translate-x-0' : 'translate-x-full'
                }`}
              ></div>

              <button
                type="button"
                onClick={() => setInputMode('excel')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-full transition-colors duration-300 cursor-pointer ${
                  inputMode === 'excel' ? 'text-white' : 'text-[#185325] hover:text-[#0e3316]'
                }`}
              >
                <HiOutlineDocumentArrowUp className="w-4 h-4 stroke-2" /> Upload Excel
              </button>

              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 rounded-full transition-colors duration-300 cursor-pointer ${
                  inputMode === 'manual' ? 'text-white' : 'text-[#185325] hover:text-[#0e3316]'
                }`}
              >
                <HiOutlineDocumentText className="w-4 h-4 stroke-2" /> Input Manual
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            {!isEditMode && inputMode === 'excel' && (
              <div className="animate-in fade-in duration-300">
                <div className="p-6 border-2 border-dashed border-[#185325]/30 bg-[#f8fbf9] rounded-2xl text-center group hover:border-[#185325] transition-colors duration-300">
                  <div className="w-12 h-12 bg-[#EBF8F1] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <HiOutlineDocumentArrowUp className="w-6 h-6 text-[#185325]" />
                  </div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">Pilih Dokumen Excel</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileChange}
                    required
                    className="w-full max-w-62.5 mx-auto block text-xs text-gray-600 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:rounded-full file:bg-[#185325] file:text-white hover:file:bg-[#123d1c] file:transition-colors file:cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-500 mt-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 inline-block">
                    *Gunakan template Excel KTH yang sudah disediakan.
                  </p>
                </div>
              </div>
            )}

            {isManualActive && (
              <div className="space-y-3.5 animate-in fade-in duration-300">
                {/* 1. Cabang Dinas Kehutanan */}
                <div>
                  <label className={labelClass}>Cabang Dinas Kehutanan</label>
                  <div className="relative">
                    <select
                      name="cdk"
                      value={formData.cdk}
                      onChange={handleInputChange}
                      required
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      <option value="">-- Pilih CDK --</option>
                      {CDK_OPTIONS.map((cdk) => (
                        <option key={cdk} value={cdk}>
                          {cdk}
                        </option>
                      ))}
                      {formData.cdk && !CDK_OPTIONS.includes(formData.cdk) && (
                        <option value={formData.cdk}>{formData.cdk}</option>
                      )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 2. Kabupaten/Kota */}
                <div>
                  <label className={labelClass}>Kabupaten/Kota</label>
                  <div className="relative">
                    <select
                      name="kabupaten_kota"
                      value={formData.kabupaten_kota}
                      onChange={handleKabupatenChange}
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      <option value="">-- Pilih Kabupaten/Kota --</option>
                      {kabupatenList.map((kab) => (
                        <option key={kab.id} value={kab.name}>
                          {kab.name}
                        </option>
                      ))}
                      {formData.kabupaten_kota &&
                        !kabupatenList.some((k) => k.name === formData.kabupaten_kota) && (
                          <option value={formData.kabupaten_kota}>{formData.kabupaten_kota}</option>
                        )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 3. Kecamatan */}
                <div>
                  <label className={labelClass}>Kecamatan</label>
                  <div className="relative">
                    <select
                      name="kecamatan"
                      value={formData.kecamatan}
                      onChange={handleKecamatanChange}
                      disabled={loadingKecamatan || (!selectedKabId && !formData.kecamatan)}
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      <option value="">
                        {loadingKecamatan ? 'Memuat Kecamatan...' : '-- Pilih Kecamatan --'}
                      </option>
                      {kecamatanList.map((kec) => (
                        <option key={kec.id} value={kec.name}>
                          {kec.name}
                        </option>
                      ))}
                      {formData.kecamatan &&
                        !kecamatanList.some((k) => k.name === formData.kecamatan) && (
                          <option value={formData.kecamatan}>{formData.kecamatan}</option>
                        )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 4. Desa/Kelurahan */}
                <div>
                  <label className={labelClass}>Desa/Kelurahan</label>
                  <div className="relative">
                    <select
                      name="desa_kelurahan"
                      value={formData.desa_kelurahan}
                      onChange={handleInputChange}
                      disabled={loadingDesa || (!selectedKecId && !formData.desa_kelurahan)}
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      <option value="">
                        {loadingDesa ? 'Memuat Desa/Kelurahan...' : '-- Pilih Desa/Kelurahan --'}
                      </option>
                      {desaList.map((desa) => (
                        <option key={desa.id} value={desa.name}>
                          {desa.name}
                        </option>
                      ))}
                      {formData.desa_kelurahan &&
                        !desaList.some((d) => d.name === formData.desa_kelurahan) && (
                          <option value={formData.desa_kelurahan}>{formData.desa_kelurahan}</option>
                        )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 5. Nomor SK / Register KTH */}
                <div>
                  <label className={labelClass}>Nomor SK / Register KTH</label>
                  <input
                    type="text"
                    name="nomor_sk"
                    value={formData.nomor_sk}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 6. Nama Kelompok KTH */}
                <div>
                  <label className={labelClass}>Nama Kelompok KTH</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 7. Nama Ketua Kelompok */}
                <div>
                  <label className={labelClass}>Nama Ketua Kelompok</label>
                  <input
                    type="text"
                    name="ketua"
                    value={formData.ketua}
                    onChange={handleInputChange}
                    required
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 8. Nomor WhatsApp Ketua */}
                <div>
                  <label className={labelClass}>Nomor WhatsApp Ketua</label>
                  <input
                    type="tel"
                    name="no_wa_ketua"
                    value={formData.no_wa_ketua}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 9. Jumlah Anggota (Orang) */}
                <div>
                  <label className={labelClass}>Jumlah Anggota (Orang)</label>
                  <input
                    type="number"
                    min="0"
                    name="jumlah_anggota"
                    value={formData.jumlah_anggota}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 10. Jenis Usaha */}
                <div>
                  <label className={labelClass}>Jenis Usaha</label>
                  <div className="relative">
                    <select
                      name="jenis_usaha"
                      value={formData.jenis_usaha}
                      onChange={handleInputChange}
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      <option value="">-- Pilih Jenis Usaha --</option>
                      {JENIS_USAHA_OPTIONS.map((jenis) => (
                        <option key={jenis} value={jenis}>
                          {jenis}
                        </option>
                      ))}
                      {formData.jenis_usaha && !JENIS_USAHA_OPTIONS.includes(formData.jenis_usaha) && (
                        <option value={formData.jenis_usaha}>{formData.jenis_usaha}</option>
                      )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 11. Kelas KTH */}
                <div>
                  <label className={labelClass}>Kelas KTH</label>
                  <input
                    type="text"
                    name="kelas_kth"
                    value={formData.kelas_kth}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 12. Alamat Lengkap Sekretariat */}
                <div>
                  <label className={labelClass}>Alamat Lengkap Sekretariat</label>
                  <input
                    type="text"
                    name="alamat_sekretariat"
                    value={formData.alamat_sekretariat}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 13. Nama Bank */}
                <div>
                  <label className={labelClass}>Nama Bank</label>
                  <div className="relative">
                    <select
                      name="nama_bank"
                      value={formData.nama_bank}
                      onChange={handleInputChange}
                      tabIndex={fieldTabIndex}
                      className={selectClass}
                    >
                      {BANK_OPTIONS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                      {formData.nama_bank && !BANK_OPTIONS.includes(formData.nama_bank) && (
                        <option value={formData.nama_bank}>{formData.nama_bank}</option>
                      )}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* 14. Nomor Rekening Bank */}
                <div>
                  <label className={labelClass}>Nomor Rekening Bank</label>
                  <input
                    type="text"
                    name="nomor_rekening"
                    value={formData.nomor_rekening}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>

                {/* 15. Nama Pemilik Rekening */}
                <div>
                  <label className={labelClass}>Nama Pemilik Rekening</label>
                  <input
                    type="text"
                    name="nama_pemilik_rekening"
                    value={formData.nama_pemilik_rekening}
                    onChange={handleInputChange}
                    tabIndex={fieldTabIndex}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className={`pt-5 ${isManualActive ? 'mt-2' : 'mt-8 border-t border-gray-100'}`}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#185325] hover:bg-[#123d1c] text-white py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : null}
                {isSubmitting
                  ? 'Memproses...'
                  : isEditMode
                    ? 'Simpan Perubahan'
                    : inputMode === 'excel'
                      ? 'Submit Data Excel'
                      : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalInputKTH;
