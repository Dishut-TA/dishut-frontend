import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type TabStatus, TABS } from './constants'; 
import { HeaderAndFilter, DataTable, BottomBanner } from './components/IndexViews';
import { getMyPenugasanAPI } from '../../../services/penugasan.service';

const MonitoringLanjutanIndex: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabStatus>('Semua Program');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchPenugasan = async () => {
      try {
        setIsLoading(true);
        const res = await getMyPenugasanAPI();
        // Filter only monitoring
        console.log(res);
        
        const monitoringData = res.data.filter((p: any) => p.jenis_kegiatan && p.jenis_kegiatan.toLowerCase().includes('monitoring'));
        setData(monitoringData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPenugasan();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-12 w-full font-sans">
      <HeaderAndFilter />

      <div className="flex flex-nowrap overflow-x-auto gap-3 mb-6 pb-2 custom-scrollbar">
        {TABS.map((tab) => (
          <button 
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors shrink-0
              ${activeTab === tab.label 
                ? tab.activeColor 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <span className={activeTab === tab.label ? '' : tab.inactiveIconColor}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable navigate={navigate} data={data} isLoading={isLoading} activeTab={activeTab} />
      <BottomBanner />

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
      `}} />
    </div>
  );
};

export default MonitoringLanjutanIndex;