import re

file_path = r"src\pages\StaffPDAS\PelaksanaanDanMonitoring\PenugasanPenyuluh\components\ViewPelaksanaan.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
if "useReactToPrint" not in content:
    content = content.replace("import { useState, useMemo, useEffect } from 'react';", "import { useState, useMemo, useEffect, useRef } from 'react';\nimport { useReactToPrint } from 'react-to-print';\nimport { TemplateRekapPelaksanaanPDF } from './TemplateRekapPelaksanaanPDF';")

# 2. Add useRef and handlePrint inside ViewPelaksanaan component
if "const pdfRef =" not in content:
    hook_insertion = """  const [tanaman, setTanaman] = useState<any[]>([]);

  const pdfRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: 'Rekap_Pelaksanaan_Penanaman'
  });"""
    content = content.replace("  const [tanaman, setTanaman] = useState<any[]>([]);", hook_insertion)

# 3. Add onClick={handlePrint} to the button
if "onClick={handlePrint}" not in content:
    old_button = """<button className="flex-1 md:flex-none px-6 py-2.5 bg-[#008A4B] text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <HiOutlinePrinter className="w-4 h-4 stroke-2" /> Cetak Rekap
            </button>"""
    new_button = """<button onClick={handlePrint} className="flex-1 md:flex-none px-6 py-2.5 bg-[#008A4B] text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <HiOutlinePrinter className="w-4 h-4 stroke-2" /> Cetak Rekap
            </button>"""
    content = content.replace(old_button, new_button)

# 4. Insert the hidden template at the end of the main div
if "<TemplateRekapPelaksanaanPDF" not in content:
    # find the last closing div of the component
    old_end = """    </div>
  );
}"""
    new_end = """      <TemplateRekapPelaksanaanPDF 
        ref={pdfRef} 
        data={data} 
        tanaman={tanaman} 
        dokumentasi={dokumentasi} 
      />
    </div>
  );
}"""
    content = content.replace(old_end, new_end)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("ViewPelaksanaan updated")
