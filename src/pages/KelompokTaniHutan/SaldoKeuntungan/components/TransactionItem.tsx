import React from "react";

interface Props {
  transaction: {
    type: string;
    date: string;
    amount: number;
    bank: string;
  };
}

const TransactionItem: React.FC<Props> = ({ transaction }) => {
  const isPositive = transaction.amount > 0;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(Math.abs(amount))
      .replace("Rp", "Rp.");
  };

  return (
    <div className="flex justify-between items-center border-b border-primary pb-4 last:border-0 last:pb-0">
      <div>
        <p className="font-bold text-primary text-sm">{transaction.type}</p>
        <p className="text-xs text-primary font-medium">{transaction.date}</p>
      </div>
      <div className="flex flex-col justify-end items-end">
        <p
          className={`font-bold text-sm ${isPositive ? "text-secondary" : "text-red-600"}`}
        >
          {isPositive ? "+" : "-"} {formatRupiah(transaction.amount)}
        </p>
        <p className="text-sm font-semibold text-primary">{transaction.bank}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
