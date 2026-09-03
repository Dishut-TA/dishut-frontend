import React from "react";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "@/utils/interface";
import TableActions from "@/components/TableAction";

interface AkunTableProps {
  data: UserProfile[];
  isLoading?: boolean;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

const AkunTable: React.FC<AkunTableProps> = ({
  data,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
      <table className="w-full min-w-200 text-sm text-left">
        <thead className="text-slate-700 bg-[#D5F0DE] border-b border-slate-100">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap"
            >
              No
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap"
            >
              Nama Pengguna
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap"
            >
              NIP
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap"
            >
              Peran Pengguna (Role)
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-semibold whitespace-nowrap text-center"
            >
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                Memuat data...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-bold text-slate-800">
                    {item.nama_pengguna}
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {item.email}
                </td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                  {item.nip ? (
                    <span className="text-xs font-medium">{item.nip}</span>
                  ) : (
                    <span className="text-slate-400 italic">Tidak ada NIP</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.peran && item.peran.length > 0 && item.peran[0] ? (
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                      {item.peran[0].nama?.replace(/_/g, " ")}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">
                      Tidak ada peran
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <TableActions
                    item={item}
                    onView={(u) =>
                      navigate(`/admin/kabid/manajemen-akun/data-pengguna/detail/${u.id}`)
                    }
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                Belum ada data akun.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AkunTable;
