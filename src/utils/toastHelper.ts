import toast from 'react-hot-toast';

/**
 * Toast Sukses
 * @param message 
 * @param id
 */
export const ToastSuccess = (message: string, id?: string) => {
  toast.success(message, { id });
};

/**
 * Toast Error
 * @param message 
 * @param id=
 */
export const ToastError = (message: string, id?: string) => {
  toast.error(message, { id });
};

/**
 * Toast Loading dan mengembalikan ID
 * @param message
 * @returns=
 */
export const ToastLoading = (message: string): string => {
  return toast.loading(message);
};

/**
 * Menutup toast tertentu atau semua toast secara paksa
 * @param id 
 */
export const ToastDismiss = (id?: string) => {
  toast.dismiss(id);
};