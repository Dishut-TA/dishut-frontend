import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

interface TableActionsProps<T> {
  item: T;
  onView?: (item: T) => void;   
  onEdit?: (item: T) => void;   
  onDelete?: (item: T) => void; 
}

const TableActions = <T,>({ item, onView, onEdit, onDelete }: TableActionsProps<T>) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {onView && (
        <button
          type="button"
          title="Lihat Detail"
          onClick={() => onView(item)}
          className="p-2 text-slate-400 hover:text-[#009262] hover:bg-[#EBF3E8] rounded-xl transition-all duration-200 active:scale-95"
        >
          <HiOutlineEye className="w-5 h-5" />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          title="Edit Data"
          onClick={() => onEdit(item)}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 active:scale-95"
        >
          <HiOutlinePencilSquare className="w-5 h-5" />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          title="Hapus Data"
          onClick={() => onDelete(item)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
        >
          <HiOutlineTrash className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default TableActions;