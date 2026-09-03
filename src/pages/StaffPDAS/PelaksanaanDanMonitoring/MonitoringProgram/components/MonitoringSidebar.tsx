import React from 'react';
import { 
  HiOutlineCalendar,
  HiOutlineExclamationTriangle,
  HiOutlineClipboardDocumentCheck,
  HiOutlineQuestionMarkCircle,
  HiArrowRight
} from 'react-icons/hi2';

const MonitoringSidebar: React.FC = () => {
  return (
    <div className="w-full xl:w-95 flex flex-col gap-6 shrink-0">
      
      {/* Card: Ringkasan Status Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-6">Ringkasan Status Program</h2>
        <div className="flex items-center gap-6">
          
          <div className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center shadow-inner" 
                style={{ background: 'conic-gradient(#10b981 0% 27%, #3b82f6 27% 45%, #8b5cf6 45% 58%, #f97316 58% 69%, #34d399 69% 100%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-gray-400">Total</span>
              <span className="text-2xl font-extrabold text-gray-800 leading-none">45</span>
            </div>
          </div>

          <div className="flex-1 space-y-2.5 text-[10px] font-bold text-gray-600">
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Siap Monitoring</div><span className="text-gray-800">12 (27%)</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Dalam Monitoring</div><span className="text-gray-800">8 (18%)</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Menunggu Evaluasi</div><span className="text-gray-800">6 (13%)</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Perlu Tindak Lanjut</div><span className="text-gray-800">5 (11%)</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Monitoring Selesai</div><span className="text-gray-800">14 (31%)</span></div>
          </div>
        </div>
      </div>

      {/* Card: Tren Status Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-1">Tren Status Program <span className="text-gray-400 font-medium text-[11px]">(6 Bulan Terakhir)</span></h2>
        
        <div className="w-full h-40 mt-4 relative">
          <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
            {/* Grid & Axes */}
            <line x1="20" y1="0" x2="300" y2="0" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="20" y1="30" x2="300" y2="30" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="20" y1="60" x2="300" y2="60" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="20" y1="90" x2="300" y2="90" stroke="#f3f4f6" strokeWidth="1"/>
            <line x1="20" y1="120" x2="300" y2="120" stroke="#e5e7eb" strokeWidth="1.5"/>
            <text x="15" y="5" fontSize="8" fill="#9ca3af" textAnchor="end">50</text>
            <text x="15" y="35" fontSize="8" fill="#9ca3af" textAnchor="end">40</text>
            <text x="15" y="65" fontSize="8" fill="#9ca3af" textAnchor="end">30</text>
            <text x="15" y="95" fontSize="8" fill="#9ca3af" textAnchor="end">20</text>
            <text x="15" y="125" fontSize="8" fill="#9ca3af" textAnchor="end">10</text>
            <text x="15" y="155" fontSize="8" fill="#9ca3af" textAnchor="end">0</text>
            <text x="40" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Jan</text>
            <text x="90" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Feb</text>
            <text x="140" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Mar</text>
            <text x="190" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Apr</text>
            <text x="240" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Mei</text>
            <text x="290" y="140" fontSize="8" fill="#6b7280" textAnchor="middle">Jun</text>

            {/* Lines */}
            <polyline points="40,80 90,65 140,55 190,40 240,30 290,25" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <polyline points="40,105 90,100 140,98 190,95 240,90 290,88" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <polyline points="40,110 90,105 140,108 190,100 240,98 290,105" fill="none" stroke="#f97316" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex justify-center gap-4 mt-8 text-[10px] font-bold text-gray-600">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Selesai</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Dalam Monitoring</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Perlu Tindak Lanjut</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-5">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100"><HiOutlineCalendar className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-1 leading-snug">Hasil monitoring Program Agroforestry Hutan Desa menunggu evaluasi.</p>
              <p className="text-[10px] font-medium text-gray-400">27 Mei 2026 • 14:20 WIB</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100"><HiOutlineExclamationTriangle className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-1 leading-snug">Program Rehabilitasi DAS Citarik perlu tindak lanjut.</p>
              <p className="text-[10px] font-medium text-gray-400">27 Mei 2026 • 10:15 WIB</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100"><HiOutlineClipboardDocumentCheck className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-1 leading-snug">Penugasan monitoring Program Rehabilitasi Mangrove Karangsong dibuat.</p>
              <p className="text-[10px] font-medium text-gray-400">26 Mei 2026 • 16:45 WIB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f0f9f3] border border-[#DCECE0] rounded-2xl p-5 flex gap-3 items-start">
        <HiOutlineQuestionMarkCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-medium text-emerald-800 leading-relaxed mb-2">
            Pastikan setiap program dimonitoring sesuai jadwal dan ditindaklanjuti untuk keberhasilan rehabilitasi.
          </p>
          <a href="#" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline">
            Pelajari lebih lanjut <HiArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default MonitoringSidebar;