import { 
  HiOutlineClipboardDocumentList, 
  HiOutlineClock, 
  HiOutlineArrowPath, 
  HiOutlineCheckCircle, 
  HiOutlineMinusCircle 
} from 'react-icons/hi2';
import { PiPlant } from 'react-icons/pi';

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <PiPlant className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Siap Monitoring</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">16</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <HiOutlineClipboardDocumentList className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Berjalan</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">9</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <HiOutlineClock className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Menunggu Evaluasi</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">7</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <HiOutlineArrowPath className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Tindak Lanjut</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">5</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Selesai</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">24</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <HiOutlineMinusCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-0.5">Dihentikan</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">3</span>
            <span className="text-xs text-slate-500 font-normal">program</span>
          </div>
        </div>
      </div>
    </div>
  );
}