const FundingNote = ({ source }: { source: string }) => (
  <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
    <p className="text-sm text-emerald-800 leading-relaxed">
      <strong className="block mb-1 text-emerald-900">Catatan Pendanaan:</strong> 
      Program ini didukung penuh dan didanai oleh {source}.
    </p>
  </div>
);

export default FundingNote;