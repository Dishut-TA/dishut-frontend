import React from "react";
import type { PermissionType } from "@/utils/interface";
import { useNavigate } from "react-router-dom";
import TableActions from "@/components/TableAction";

interface PermissionTableProps {
  data: PermissionType[];
  isLoading?: boolean;
  onEdit: (permission: PermissionType) => void;
  onDelete: (permission: PermissionType) => void;
}

const PermissionTable: React.FC<PermissionTableProps> = ({
  data,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const capitalizeWords = (text: string) => {
    return text
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="w-full min-w-200 text-sm text-left">
        <thead className="text-gray-700 bg-[#D5F0DE]">
          <tr>
            <th
              scope="col"
              className="px-4 py-4 font-semibold whitespace-nowrap"
            >
              No
            </th>
            <th
              scope="col"
              className="px-4 py-4 font-semibold whitespace-nowrap"
            >
              Nama Izin (Permission)
            </th>
            <th
              scope="col"
              className="px-4 py-4 font-semibold whitespace-nowrap"
            >
              Nama Penjaga (Guard)
            </th>
            <th
              scope="col"
              className="px-4 py-4 font-semibold whitespace-nowrap text-center"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                Memuat data...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-gray-600">{index + 1}</td>
                <td className="px-4 py-4">
                  <span className="font-bold text-gray-800">
                    {capitalizeWords(item.nama)}
                  </span>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">
                    {item.nama}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600">
                    {item.nama_penjaga}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <TableActions
                    item={item}
                    onView={(p) =>
                      navigate(
                        `/admin/kabid/manajemen-akun/data-peran-pengguna/detail/${p.id}`,
                      )
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                Belum ada data izin.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionTable;
