import { HiOutlineMapPin, HiOutlineInformationCircle } from 'react-icons/hi2';
import PetaPetakUkur, { type TitikPetakUkur } from '@/components/maps/PetaPetakUkur';

export default function MapMockup({ locations = [] }: { locations?: TitikPetakUkur[] }) {
  const titik = Array.isArray(locations) ? locations : [];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Peta Sebaran Program Rehabilitasi</h3>
        <div className="flex gap-4 text-[11px] font-bold">
          <span className="flex items-center gap-1.5"><HiOutlineMapPin className="w-4 h-4 text-emerald-600"/> Donasi</span>
          <span className="flex items-center gap-1.5"><HiOutlineMapPin className="w-4 h-4 text-blue-600"/> APBD</span>
          <span className="flex items-center gap-1.5"><HiOutlineMapPin className="w-4 h-4 text-purple-600"/> CSR</span>
        </div>
      </div>

      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
        <PetaPetakUkur
          titik={titik}
          emptyMessage="Belum ada petak ukur berkoordinat. Peta akan terisi setelah penyuluh menggambar batas petak."
        />
      </div>

      <div className="mt-3 text-[10px] text-gray-500 flex items-center gap-1.5">
        <HiOutlineInformationCircle className="w-4 h-4 text-emerald-600" />
        {titik.length > 0
          ? `Menampilkan ${titik.length} petak ukur. Klik marker untuk melihat detail program.`
          : 'Titik peta bersumber dari batas petak ukur yang digambar penyuluh.'}
      </div>
    </div>
  );
}
