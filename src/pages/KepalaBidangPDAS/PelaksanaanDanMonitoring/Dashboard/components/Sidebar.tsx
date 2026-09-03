import { 
  HiOutlineSquares2X2, HiOutlineListBullet, HiOutlineMapPin, 
  HiOutlineDocumentChartBar, HiOutlineChartBar, HiOutlineVideoCamera, 
  HiOutlineClipboardDocumentCheck, HiOutlineDocumentDuplicate, 
  HiOutlineArrowDownTray, HiOutlineUsers, HiOutlineCog6Tooth, 
  HiOutlineGlobeAlt 
} from 'react-icons/hi2';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-white border-2 border-emerald-700 text-emerald-700 rounded flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <span className="font-bold text-sm leading-tight text-emerald-800">PROGRAM REHABILITASI<br/>DAS & LAHAN</span>
      </div>

      <div className="p-4 flex-1">
        <div className="mb-6">
          <a href="#" className="flex items-center gap-3 bg-[#065f46] text-white px-4 py-2.5 rounded-lg text-sm font-medium">
            <HiOutlineSquares2X2 className="w-5 h-5" /> Dashboard
          </a>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 px-4 uppercase tracking-wider">Program</p>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineListBullet className="w-5 h-5" /> Daftar Program</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineMapPin className="w-5 h-5" /> Sebaran Lokasi</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineDocumentChartBar className="w-5 h-5" /> Ringkasan Program</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 px-4 uppercase tracking-wider">Monitoring & Evaluasi</p>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineChartBar className="w-5 h-5" /> Realisasi Penanaman</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineVideoCamera className="w-5 h-5" /> Monitoring Kegiatan</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineClipboardDocumentCheck className="w-5 h-5" /> Evaluasi Program</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 px-4 uppercase tracking-wider">Ringkasan</p>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineDocumentDuplicate className="w-5 h-5" /> Rekapitulasi</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineArrowDownTray className="w-5 h-5" /> Unduh Ringkasan</a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 mb-3 px-4 uppercase tracking-wider">Pengaturan</p>
            <div className="space-y-1">
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineUsers className="w-5 h-5" /> Pengguna</a>
              <a href="#" className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium"><HiOutlineCog6Tooth className="w-5 h-5" /> Pengaturan</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <a href="#" className="flex items-center gap-3 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-bold">
          <HiOutlineGlobeAlt className="w-5 h-5" /> Kembali ke Website
        </a>
      </div>
    </aside>
  );
}