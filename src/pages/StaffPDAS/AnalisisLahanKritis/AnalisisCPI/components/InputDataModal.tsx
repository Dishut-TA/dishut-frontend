import React, { useEffect, useMemo, useState } from "react";
import { HiOutlineArrowPath, HiOutlineDocumentArrowUp, HiXMark } from "react-icons/hi2";
import { reanalyzeDataGIS, uploadDataGIS } from "@/services/gisService";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";

interface InputDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
  /**
   * Pada mode edit, project WAJIB berasal dari GET /projects/{id}/edit-data
   * yang dipanggil parent SEBELUM modal dibuka.
   */
  project?: any | null;
}

type FieldId = 'das' | 'dem' | 'tutupan_lahan' | 'curah_hujan' | 'jenis_tanah' | 'batas_wilayah';

type FieldConfig = {
  id: FieldId;
  label: string;
  accept: string;
  allowedExtensions: string[];
  caption: string;
  required: boolean;
};

type ExistingIndicator = {
  label?: string;
  filename?: string | null;
  extension?: string | null;
  format?: string | null;
  required?: boolean;
  exists?: boolean;
  size_bytes?: number | null;
  size_mb?: number | null;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const makeEmptyFiles = (): Record<FieldId, File | null> => ({
  das: null,
  dem: null,
  tutupan_lahan: null,
  curah_hujan: null,
  jenis_tanah: null,
  batas_wilayah: null,
});

const formFields: FieldConfig[] = [
  {
    id: "das",
    label: "Data Daerah Aliran Sungai (DAS)",
    accept: ".zip,.geojson,.json",
    allowedExtensions: ["zip", "geojson", "json"],
    caption: "*File SHP (.zip) / GeoJSON, maks. 5 MB. ZIP SHP wajib berisi .shp, .shx, .dbf, dan .prj.",
    required: true,
  },
  {
    id: "dem",
    label: "Data Elevation Model (DEM)",
    accept: ".tif,.tiff",
    allowedExtensions: ["tif", "tiff"],
    caption: "*File TIF, maks. 5 MB",
    required: true,
  },
  {
    id: "tutupan_lahan",
    label: "Data Tutupan Lahan",
    accept: ".tif,.tiff,.zip,.geojson,.json",
    allowedExtensions: ["tif", "tiff", "zip", "geojson", "json"],
    caption: "*File TIF atau SHP (.zip) / GeoJSON, maks. 5 MB",
    required: true,
  },
  {
    id: "curah_hujan",
    label: "Data Curah Hujan",
    accept: ".tif,.tiff",
    allowedExtensions: ["tif", "tiff"],
    caption: "*File TIF, maks. 5 MB",
    required: true,
  },
  {
    id: "jenis_tanah",
    label: "Data Jenis Tanah",
    accept: ".tif,.tiff,.zip,.geojson,.json",
    allowedExtensions: ["tif", "tiff", "zip", "geojson", "json"],
    caption: "*File TIF atau SHP (.zip) / GeoJSON, maks. 5 MB",
    required: true,
  },
  {
    id: "batas_wilayah",
    label: "Data Batas Wilayah",
    accept: ".zip,.geojson,.json",
    allowedExtensions: ["zip", "geojson", "json"],
    caption: "*File SHP (.zip) / GeoJSON, maks. 5 MB (opsional)",
    required: false,
  },
];

const InputDataModal: React.FC<InputDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project,
}) => {
  const isEditMode = Boolean(project?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [namaProject, setNamaProject] = useState("");
  const [files, setFiles] = useState<Record<FieldId, File | null>>(makeEmptyFiles());

  const currentFiles = useMemo<Record<string, string | null>>(
    () => project?.file_input ?? {},
    [project]
  );

  const indicators = useMemo<Record<string, ExistingIndicator>>(
    () => project?.indicators ?? {},
    [project]
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setNamaProject(project?.nama_project ?? "");
    setFiles(makeEmptyFiles());
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: FieldConfig) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFiles((prev) => ({ ...prev, [field.id]: null }));
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!field.allowedExtensions.includes(extension)) {
      e.target.value = '';
      ToastError(`Format ${file.name} tidak sesuai untuk ${field.label}.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      e.target.value = '';
      ToastError(`${field.label} melebihi batas 5 MB.`);
      return;
    }

    setFiles((prev) => ({ ...prev, [field.id]: file }));
  };

  const validateFiles = () => {
    if (!isEditMode) {
      const missing = formFields.filter((field) => field.required && !files[field.id]);
      if (missing.length > 0) {
        ToastError(`File wajib belum lengkap: ${missing.map((field) => field.label).join(', ')}.`);
        return false;
      }
      return true;
    }

    // Bila metadata backend mengatakan file wajib lama sudah tidak ada di storage,
    // user harus mengunggah ulang indikator tersebut sebelum re-analysis.
    const missingOnServer = formFields.filter((field) => {
      if (!field.required) return false;
      const meta = indicators[field.id];
      if (!meta) return !currentFiles[field.id] && !files[field.id];
      return meta.exists === false && !files[field.id];
    });

    if (missingOnServer.length > 0) {
      ToastError(`File lama tidak ditemukan di server. Upload ulang: ${missingOnServer.map((field) => field.label).join(', ')}.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProject.trim()) {
      ToastError("Nama Project tidak boleh kosong!");
      return;
    }

    if (!validateFiles()) return;

    if (
      isEditMode &&
      !Object.values(files).some(Boolean) &&
      namaProject.trim() === String(project?.nama_project ?? '').trim()
    ) {
      ToastError("Belum ada data yang diubah. Pilih minimal satu file indikator atau ubah nama project.");
      return;
    }

    setIsLoading(true);
    const loadingId = ToastLoading(
      isEditMode
        ? "Mengunggah pengganti, memvalidasi lokasi, dan menganalisis ulang..."
        : "Mengunggah, memvalidasi koordinat, dan menganalisis data GIS..."
    );

    try {
      const formData = new FormData();
      formData.append("nama_project", namaProject.trim());
      formData.append("target_resolution", "100");
      formData.append("save_intermediate", "0");

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const response = isEditMode
        ? await reanalyzeDataGIS(project.id, formData)
        : await uploadDataGIS(formData);

      ToastSuccess(
        isEditMode
          ? "Data peta berhasil diperbarui dan dianalisis ulang."
          : "Data berhasil diunggah dan dianalisis!",
        loadingId
      );
      onSuccess?.(response);
      onClose();
    } catch (error: any) {
      ToastError(
        error?.message || (isEditMode ? "Gagal memperbarui data peta" : "Gagal mengunggah data"),
        loadingId
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "Edit Data Peta" : "Input Data Indikator"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isEditMode
                ? "Data lama sudah diambil dari server. Pilih hanya indikator yang ingin ditimpa."
                : "Lengkapi indikator GIS untuk membentuk data peta CPI."}
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-2 text-gray-500 cursor-pointer hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <HiXMark className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          {isEditMode && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
              <div className="font-bold">✓ Data project lama berhasil di-GET</div>
              <div className="mt-1">
                Project: <span className="font-semibold">{project?.nama_project || project?.kode_project || project?.id}</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-700">
                File yang tidak kamu pilih ulang akan tetap menggunakan file aktif di bawah ini.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="nama_project" className="text-sm font-semibold text-gray-800">
                Nama Project <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama_project"
                required
                value={namaProject}
                onChange={(e) => setNamaProject(e.target.value)}
                placeholder="Contoh: Analisis DAS Citarum Hulu"
                disabled={isLoading}
                className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#185325] focus:border-transparent transition-all disabled:opacity-60"
              />
            </div>

            {formFields.map((field) => {
              const activeFile = currentFiles[field.id] ?? indicators[field.id]?.filename ?? null;
              const meta = indicators[field.id];
              const selectedFile = files[field.id];
              const existingMissing = isEditMode && field.required && meta?.exists === false;

              return (
                <div key={field.id} className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 bg-gray-50/40">
                  <div className="flex items-start justify-between gap-3">
                    <label htmlFor={field.id} className="text-sm font-semibold text-gray-800">
                      {field.label}
                      {!isEditMode && field.required && <span className="text-red-500"> *</span>}
                    </label>
                    {isEditMode && activeFile && !existingMissing && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                        Data aktif
                      </span>
                    )}
                    {existingMissing && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded-full">
                        Upload ulang
                      </span>
                    )}
                  </div>

                  {isEditMode && (
                    <div className={`text-xs bg-white border rounded-lg px-3 py-2 break-all ${existingMissing ? 'border-red-200 text-red-700' : 'border-gray-100 text-gray-600'}`}>
                      <div>
                        <span className="font-semibold">File saat ini:</span>{' '}
                        {activeFile || "Belum ada file"}
                      </div>
                      {meta?.size_mb !== null && meta?.size_mb !== undefined && (
                        <div className="mt-1 text-[11px] text-gray-500">
                          Ukuran: {meta.size_mb} MB · Format: {meta.format || meta.extension || '-'}
                        </div>
                      )}
                      {existingMissing && (
                        <div className="mt-1 text-[11px] font-semibold">
                          Metadata project ada, tetapi file fisik tidak ditemukan di storage backend.
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    id={field.id}
                    accept={field.accept}
                    required={!isEditMode && field.required}
                    disabled={isLoading}
                    onChange={(e) => handleFileChange(e, field)}
                    className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-[#185325] focus:border-transparent file:mr-4 file:py-2.5 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer transition-all disabled:opacity-60"
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-[11px] text-gray-500">{field.caption}</p>
                    {isEditMode && !existingMissing && (
                      <p className="text-[11px] text-emerald-700">
                        Biarkan kosong jika indikator ini tidak berubah.
                      </p>
                    )}
                    {isEditMode && selectedFile && (
                      <p className="text-[11px] font-medium text-[#185325] break-all">
                        File pengganti: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    {!isEditMode && selectedFile && (
                      <p className="text-[11px] font-medium text-[#185325] break-all">
                        File dipilih: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-[11px] leading-relaxed text-amber-900">
              Saat disimpan, backend menggabungkan file lama + file pengganti, memvalidasi CRS/overlap lokasi seluruh indikator, lalu menjalankan analisis ulang.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-1 w-full flex items-center justify-center gap-2 bg-[#185325] text-white font-semibold rounded-full py-3.5 transition-colors shadow-sm ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#113d1b] cursor-pointer"}`}
            >
              {isEditMode ? <HiOutlineArrowPath className="w-4 h-4" /> : <HiOutlineDocumentArrowUp className="w-4 h-4" />}
              {isLoading
                ? (isEditMode ? "Menganalisis Ulang..." : "Menganalisis...")
                : (isEditMode ? "Timpa Data & Analisis Ulang" : "Mulai Analisis")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputDataModal;
