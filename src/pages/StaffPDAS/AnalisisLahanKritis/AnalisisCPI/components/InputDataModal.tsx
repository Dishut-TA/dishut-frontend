import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { uploadDataGIS } from "@/services/gisService"; // Pastikan path sesuai
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper"; // Pastikan path sesuai

interface InputDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

const InputDataModal: React.FC<InputDataModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [namaProject, setNamaProject] = useState("");
  const [files, setFiles] = useState<Record<string, File | null>>({
    das: null,
    dem: null,
    tutupan_lahan: null,
    curah_hujan: null,
    jenis_tanah: null,
    batas_wilayah: null,
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setNamaProject("");
      setFiles({
        das: null,
        dem: null,
        tutupan_lahan: null,
        curah_hujan: null,
        jenis_tanah: null,
        batas_wilayah: null
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => ({ ...prev, [fieldId]: e.target.files![0] }));
    }
  };

  // TAMBAHKAN PROPERTI 'accept' DISINI UNTUK MENCEGAH WINDOWS EXPLORER CRASH
  const formFields = [
    { id: "das", label: "Input Data Daerah Aliran Sungai (DAS)", accept: ".zip,.geojson,.json" },
    { id: "dem", label: "Input Data Elevation Model (DEM)", accept: ".tif,.tiff" },
    { id: "tutupan_lahan", label: "Input Data Tutupan Lahan", accept: ".tif,.tiff,.zip,.geojson,.json" },
    { id: "curah_hujan", label: "Input Data Curah Hujan", accept: ".tif,.tiff" },
    { id: "jenis_tanah", label: "Input Data Jenis Tanah", accept: ".tif,.tiff,.zip,.geojson,.json" },
    { id: "batas_wilayah", label: "Input Data Batas Wilayah", accept: ".zip,.geojson,.json" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProject.trim()) {
      return ToastError("Nama Project tidak boleh kosong!");
    }

    setIsLoading(true);
    const loadingId = ToastLoading("Sedang mengunggah dan menganalisis data GIS...");

    try {
      const formData = new FormData();
      formData.append("nama_project", namaProject);
      formData.append("target_resolution", "100");
      formData.append("save_intermediate", "0");

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const response = await uploadDataGIS(formData);
      console.log("data terkirim: ", response);

      ToastSuccess("Data berhasil diunggah dan dianalisis!", loadingId);
      if (onSuccess) onSuccess(response);
      onClose();
    } catch (error: any) {
      ToastError(error.message || "Gagal mengunggah data", loadingId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Upload Data GIS</h2>
          <button onClick={onClose} className="p-2 text-gray-500 cursor-pointer hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <HiXMark className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
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
                className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#185325] focus:border-transparent transition-all"
              />
            </div>

            {formFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-semibold text-gray-800">
                  {field.label}
                </label>
                {/* TERAPKAN ACCEPT DISINI */}
                <input
                  type="file"
                  id={field.id}
                  accept={field.accept}
                  onChange={(e) => handleFileChange(e, field.id)}
                  className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-[#185325] focus:border-transparent file:mr-4 file:py-2.5 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer transition-all"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full flex items-center justify-center bg-[#185325] text-white font-semibold rounded-full py-3.5 transition-colors shadow-sm ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#113d1b] cursor-pointer"}`}
            >
              {isLoading ? "Mengunggah..." : "Mulai Analisis"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputDataModal;