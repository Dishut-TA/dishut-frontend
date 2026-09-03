import React, { useState, useRef } from 'react';
import { 
  HiOutlineMagnifyingGlassPlus,
  HiOutlineMagnifyingGlassMinus,
  HiOutlineArrowPath,
  HiOutlinePencil,
  HiOutlineTrash
} from 'react-icons/hi2';

interface ZoomableImagePreviewProps {
  src: string;
  onClear: () => void;
  onChangeClick: () => void;
}

const ZoomableImagePreview: React.FC<ZoomableImagePreviewProps> = ({ src, onClear, onChangeClick }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleZoomIn = (e: React.MouseEvent) => { e.preventDefault(); setScale(p => Math.min(p + 0.5, 4)); };
  const handleZoomOut = (e: React.MouseEvent) => { e.preventDefault(); setScale(p => Math.max(p - 0.5, 1)); };
  const handleReset = (e: React.MouseEvent) => { e.preventDefault(); setScale(1); setPosition({ x: 0, y: 0 }); };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) setScale(p => Math.min(p + 0.2, 4));
    else setScale(p => Math.max(p - 0.2, 1));
  };

  const startDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - position.x, y: clientY - position.y };
  };
  const onDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPosition({ x: clientX - dragStart.current.x, y: clientY - dragStart.current.y });
  };
  const endDrag = () => setIsDragging(false);

  return (
    <div 
      className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden bg-slate-100 group border-2 border-transparent hover:border-[#009262]/30 transition-colors"
      onWheel={handleWheel}
      onMouseLeave={endDrag}
      onMouseUp={endDrag}
      onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
      onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => onDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={endDrag}
    >
      <img 
        src={src} 
        alt="Preview" 
        draggable={false}
        className={`w-full h-full object-cover ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out' 
        }}
      />

      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={onChangeClick} className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-[#009262] rounded-lg shadow-sm transition-colors" title="Ganti Foto">
          <HiOutlinePencil className="w-5 h-5" />
        </button>
        <button type="button" onClick={onClear} className="p-2 bg-white/90 backdrop-blur text-slate-700 hover:text-red-500 rounded-lg shadow-sm transition-colors" title="Hapus Foto">
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-1.5 bg-white/90 backdrop-blur p-1.5 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={handleZoomOut} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom Out">
          <HiOutlineMagnifyingGlassMinus className="w-5 h-5" />
        </button>
        <button type="button" onClick={handleReset} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Reset Posisi">
          <HiOutlineArrowPath className="w-5 h-5" />
        </button>
        <button type="button" onClick={handleZoomIn} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom In">
          <HiOutlineMagnifyingGlassPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Scroll / Drag
      </div>
    </div>
  );
};

export default ZoomableImagePreview;