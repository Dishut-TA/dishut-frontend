import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { MonitoringRow, MonitoringStatus, ViewMode } from './types';
import { ReadOnlyView } from './components/ReadOnlyView';
import { RekapView } from './components/RekapView';
import { TableView } from './components/TableView';
import { InputEditView } from './components/InputEditView';

const FormMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const activeId = id || 'PRG-2026-0007';
  
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_PELAKSANAAN_URL || 'http://127.0.0.1:8000/api';
        const res = await axios.get(`${API_URL}/penugasan/${activeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        if (res.data?.data) {
          const raw = res.data.data;
          if (raw.formatted_data) {
            raw.nama = raw.formatted_data.nama_program;
            raw.lokasi = raw.formatted_data.lokasi;
            raw.kth = raw.formatted_data.ketua_kth;
            raw.sumber_dana = raw.formatted_data.sumber_dana;
            raw.periode = raw.formatted_data.periode_monitoring;
          }
          setActiveProgram(raw);
        }
      } catch (err) {
        console.error("Error fetching program:", err);
        // Jangan jatuh ke data contoh: menampilkan program lain saat request
        // gagal membuat penyuluh mengisi monitoring untuk program yang salah.
        setActiveProgram(null);
        setError('Gagal memuat data program. Periksa koneksi lalu muat ulang halaman.');
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [activeId]);

  const programStatus = (location.state?.status as MonitoringStatus) || (activeProgram?.status || 'Siap Monitoring');

  const isTindakLanjut = programStatus === 'Tindak Lanjut';
  const isReadOnly = programStatus === 'Menunggu Evaluasi' || programStatus === 'Selesai';

  const [viewMode, setViewMode] = useState<ViewMode>('rekap');
  const [selectedRow, setSelectedRow] = useState<MonitoringRow | null>(null);
  const [selectedPuId, setSelectedPuId] = useState<any>(null);

  const handleOpenForm = (mode: 'input' | 'edit', row: MonitoringRow) => {
    setSelectedRow(row);
    setViewMode(mode);
  };

  const handleBackToTable = () => {
    setViewMode('table');
    setSelectedRow(null);
  };

  const handleBackToRekap = () => {
    setViewMode('rekap');
    setSelectedRow(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat data...</div>;
  }

  if (error || !activeProgram) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {error || 'Data program tidak ditemukan.'}
        </p>
      </div>
    );
  }

  if (isReadOnly) {
    return (
      <ReadOnlyView
        activeId={activeId}
        activeProgram={activeProgram}
        programStatus={programStatus}
        navigate={navigate}
      />
    );
  }

  switch (viewMode) {
    case 'rekap':
      return (
        <RekapView
          activeId={activeId}
          activeProgram={activeProgram}
          isTindakLanjut={isTindakLanjut}
          setViewMode={setViewMode}
          setSelectedPuId={setSelectedPuId}
          navigate={navigate}
        />
      );
    case 'table':
      return (
        <TableView
          activeId={activeId}
          activeProgram={activeProgram}
          selectedPuId={selectedPuId}
          isTindakLanjut={isTindakLanjut}
          handleBackToRekap={handleBackToRekap}
          handleOpenForm={handleOpenForm}
        />
      );
    case 'input':
    case 'edit':
      return (
        <InputEditView
          activeId={activeId}
          activeProgram={activeProgram}
          isTindakLanjut={isTindakLanjut}
          isEdit={viewMode === 'edit'}
          selectedRow={selectedRow}
          handleBackToTable={handleBackToTable}
        />
      );
    default:
      return null;
  }
};

export default FormMonitoringPage;