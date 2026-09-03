import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineChevronDown, HiCheck } from 'react-icons/hi';

interface Transaction {
  id: number;
  type: 'Transfer Bank' | 'Isi Saldo' | 'Tarik Saldo';
  date: string;
  amount: number;
  bank: string;
}

type FilterOption = 'Semua Transaksi' | 'Isi Saldo' | 'Tarik Saldo' | 'Transfer Bank';

const mockTransactions: Transaction[] = [
  { id: 1, type: 'Transfer Bank', date: '10/09/2024 - 10.00', amount: -1000000, bank: 'Bank BCA' },
  { id: 2, type: 'Isi Saldo', date: '01/01/2024 - 19.00', amount: 8000000, bank: 'Bank BCA' },
  { id: 3, type: 'Isi Saldo', date: '01/02/2024 - 19.00', amount: 1000000, bank: 'Bank BCA' },
  { id: 4, type: 'Transfer Bank', date: '11/07/2024 - 10.00', amount: -15000000, bank: 'Bank BCA' },
];

const filterOptions: FilterOption[] = [
  'Semua Transaksi',
  'Isi Saldo',
  'Tarik Saldo',
  'Transfer Bank'
];

const RiwayatTransaksi: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('Semua Transaksi');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (selectedFilter === 'Semua Transaksi') return true;
    return tx.type === selectedFilter;
  });

  const formatRupiah = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(absoluteAmount).replace('Rp', 'Rp ');

    return isNegative ? `- ${formatted}` : `+ ${formatted}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 mt-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="text-center mb-10">
        <h2 className="text-primary font-bold text-2xl md:text-3xl">Riwayat Transaksi</h2>
      </div>

      <div className="flex justify-end mb-6 relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:text-green-800 transition-colors"
        >
          {selectedFilter}
          <HiOutlineChevronDown 
            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
          />
        </button>

        <div 
          className={`absolute top-8 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-2 transition-all duration-200 origin-top-right
            ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
          `}
        >
          {filterOptions.map((option) => (
            <div
              key={option}
              onClick={() => {
                setSelectedFilter(option);
                setIsDropdownOpen(false);
              }}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm hover:bg-green-50 transition-colors ${
                selectedFilter === option ? 'text-primary font-semibold bg-green-50/50' : 'text-gray-600'
              }`}
            >
              <span>{option}</span>
              {selectedFilter === option && <HiCheck className="text-primary" />}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex justify-between items-center py-4 border-b border-primary last:border-0"
            >
              <div className="space-y-1">
                <p className="font-bold text-primary text-sm md:text-base">{tx.type}</p>
                <p className="text-xs font-medium text-primary">{tx.date}</p>
              </div>
              <div className="text-right space-y-1">
                <p className={`font-bold text-sm md:text-base ${tx.amount < 0 ? 'text-red-600' : 'text-secondary'}`}>
                  {formatRupiah(tx.amount)}
                </p>
                <p className="text-xs text-primary font-medium">{tx.bank}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            Tidak ada transaksi untuk filter ini.
          </div>
        )}
      </div>

    </div>
  );
};

export default RiwayatTransaksi;