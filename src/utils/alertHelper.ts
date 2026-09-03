import Swal from 'sweetalert2';

export const confirmAction = async (
  title: string,
  text: string,
  confirmText: string = 'Ya, Lanjutkan',
  isDanger: boolean = false
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: isDanger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonColor: isDanger ? '#ef4444' : '#185325', 
    cancelButtonColor: '#f1f5f9',
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    reverseButtons: true, 
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-xl font-bold text-slate-800',
      htmlContainer: 'text-sm text-slate-600',
      confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md',
      cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200',
    }
  });

  return result.isConfirmed; 
};