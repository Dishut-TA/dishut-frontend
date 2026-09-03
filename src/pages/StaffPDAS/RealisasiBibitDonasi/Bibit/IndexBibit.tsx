import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getBibitsAPI, getSeedSpecificationsAPI, type BibitResponseData } from "@/services/bibit.service";
import BibitToolbar from "./components/BibitToolbar"; 
import BibitTable from "./components/BibitTable";

export interface MappedBibitData extends BibitResponseData {
  tinggiFormat: string;
  hargaFormat: string;
  totalStok: number;
}

const formatRupiah = (angka: number) => 
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

const IndexBibit: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTinggi, setFilterTinggi] = useState("Semua");
  const [bibitData, setBibitData] = useState<MappedBibitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bibitRes, spekRes] = await Promise.all([
          getBibitsAPI(),
          getSeedSpecificationsAPI(),
        ]);

        const mergedData: MappedBibitData[] = bibitRes.payload.map((bibit: BibitResponseData) => {
          const spec = spekRes.payload.find((s: any) => s.seed_id === bibit.id);

          let tinggiText = "Belum diatur";
          if (spec) {
            tinggiText = (spec.max_height === 0 || spec.min_height > 100) 
              ? "> 100 cm" 
              : `${spec.min_height}–${spec.max_height} cm`;
          }

          return {
            ...bibit,
            tinggiFormat: tinggiText,
            hargaFormat: spec ? formatRupiah(Number(spec.price)) : "Belum diatur",
            totalStok: spec ? Number(spec.stock) : 0,
          };
        });

        setBibitData(mergedData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = bibitData.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTinggi = filterTinggi === "Semua" || item.tinggiFormat === filterTinggi;
    return matchesSearch && matchesTinggi;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto pb-8">
      <BibitToolbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterTinggi={filterTinggi}
        setFilterTinggi={setFilterTinggi}
        onAddClick={() => navigate("/admin/staff/donasi/bibit/create")}
      />

      <BibitTable 
        data={filteredData} 
        isLoading={isLoading} 
        onViewDetail={(id) => navigate(`/admin/staff/donasi/bibit/detail/${id}`)}
      />
    </div>
  );
};

export default IndexBibit;