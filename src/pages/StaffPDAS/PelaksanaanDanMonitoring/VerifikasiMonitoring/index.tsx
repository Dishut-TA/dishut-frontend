import React from 'react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import Filters from './components/Filters';
import TableList from './components/TableList';

const MonitoringProgram: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto bg-[#F8FAFC] min-h-screen p-6 font-sans text-slate-800">
      <Header />
      <StatCards />
      <Filters />
      <TableList />
    </div>
  );
};

export default MonitoringProgram;