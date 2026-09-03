import {
    HiOutlineHome, HiOutlineChartBar, HiOutlineComputerDesktop,
    HiOutlineGlobeAlt, HiOutlineArchiveBox, HiOutlineBookmark,
    HiOutlineUser, HiOutlineDocumentText, HiOutlineClock,
    HiOutlineChartPie, HiOutlineBanknotes, HiOutlineUsers,
    HiOutlineDocumentChartBar, HiOutlineMap, HiOutlinePresentationChartLine,
    HiOutlineEye, HiOutlineSparkles, HiOutlineMapPin,
    HiOutlineWallet
} from 'react-icons/hi2';
import { ROLES } from '@/utils/roles';
import { canManageAccounts } from '@/utils/rbac';
import { PiPlant } from 'react-icons/pi';

export const getSidebarMenus = (basePath: string, userRole: string, user: any) => {

    // Global Menu 
    const dashboard = {
        name: 'Dashboard',
        path: `${basePath}/dashboard`,
        icon: <HiOutlineHome className="w-5 h-5" />
    };

    const masterBibit = {
        name: 'Master Bibit',
        path: `${basePath}/master/master-bibit`,
        icon: <PiPlant className="w-5 h-5" />
    };

    const menuManajemenAkun = {
        id: 'manajemen-akun',
        title: 'Manajemen Akun',
        icon: <HiOutlineUser className="w-5 h-5" />,
        items: [
            { name: 'Data Pengguna', path: `${basePath}/manajemen-akun/data-pengguna` },
            { name: 'Data Peran Pengguna', path: `${basePath}/manajemen-akun/data-peran-pengguna` },
            { name: 'Data Hak Akses', path: `${basePath}/manajemen-akun/data-hak-akses` },
        ],
    };

    // Staff PDAS (Contoh penerapan array tunggal)
    const staffMenus = [
        dashboard,
        masterBibit,
        {
            id: 'cpi', title: 'Analisis CPI', icon: <HiOutlineChartBar className="w-5 h-5" />,
            items: [
                { name: 'Dashboard CPI', path: `${basePath}/analisis-cpi/dashboard` },
                { name: 'Data KTH', path: `${basePath}/analisis-cpi/kth` },
                { name: 'Data Peta', path: `${basePath}/analisis-cpi/peta` },
                { name: 'Rencana Rehabilitasi', path: `${basePath}/analisis-cpi/rencana` },
                // { name: 'Data Zonasi', path: `${basePath}/analisis-cpi/zonasi` },
            ],
        },
        {
            id: 'donasi', title: 'Realisasi Bibit dan Donasi', icon: <HiOutlineArchiveBox className="w-5 h-5" />,
            items: [
                { name: 'Dashboard Program', path: `${basePath}/donasi/dashboard` },
                { name: 'Data Bibit', path: `${basePath}/donasi/bibit` },
                { name: 'Data Program', path: `${basePath}/donasi/program` },
                { name: 'Data Donasi', path: `${basePath}/donasi/donatur` },
                { name: 'Pelaksanaan Kegiatan', path: `${basePath}/donasi/pelaksanaan-kegiatan` },
            ],
        },
        {
            id: 'rehabilitasi', title: 'Rehabilitasi', icon: <HiOutlineBookmark className="w-5 h-5" />,
            items: [
                { name: 'Daftar Program APBD', path: `${basePath}/rehabilitasi/program-apbd` },
                { name: 'Program CSR', path: `${basePath}/rehabilitasi/program-csr` },
                { name: 'Verifikasi Laporan Dana', path: `${basePath}/rehabilitasi/verifikasi-dana` },
                // { name: 'Laporan Dana', path: `${basePath}/rehabilitasi/laporan-dana` },
                { name: 'Riwayat Rehabilitasi', path: `${basePath}/rehabilitasi/riwayat-rehabilitasi` },
            ],
        },
        {
            id: 'monitoring',
            title: 'Pelaksanaan dan Monitoring Program',
            icon: <HiOutlineComputerDesktop className="w-5 h-5" />,
            items: [
                { name: 'Dashboard', path: `${basePath}/monitoring/dashboard` },
                { name: 'Penugasan Kegiatan Rehabilitasi ', path: `${basePath}/monitoring/penugasan-pelaksanaan` },
                // { name: 'Pelaksanaan Kegiatan Rehabilitasi', path: `${basePath}/monitoring/kegiatan` },
                // { name: 'Hasil Validasi Lokasi', path: `${basePath}/monitoring/hasil-validasi-lokasi` },
                { name: 'Monitoring Program Rehabilitasi', path: `${basePath}/monitoring/verifikasi` },
            ],
        },
        {
            id: 'evaluasi', title: 'Evaluasi Penanaman Bibit', icon: <HiOutlineGlobeAlt className="w-5 h-5" />,
            items: [
                { name: 'Dashboard Evaluasi', path: `${basePath}/evaluasi/dashboard` },
                { name: 'Penugasan Evaluasi', path: `${basePath}/evaluasi/penugasan` },
                { name: 'Perhitungan Hasil Evaluasi', path: `${basePath}/evaluasi/hasil` },
                // { name: 'Laporan Evaluasi', path: `${basePath}/evaluasi/laporan` },
            ],
        },
        ...(canManageAccounts(user) ? [menuManajemenAkun] : [])
    ];

    // Kabid PDAS & SUPERADMIN
    const kabidDanSuperadminMenus = [
        dashboard,
        {
            id: 'cpi', title: 'Analisis CPI', icon: <HiOutlineChartBar className="w-5 h-5" />,
            items: [
                { name: 'Dashboard CPI', path: `${basePath}/analisis-cpi/dashboard` },
                { name: 'Hasil Validasi Lokasi', path: `${basePath}/analisis-cpi/hasil-validasi-lokasi` },
            ],
        },
        {
            id: 'donasi', title: 'Realisasi Bibit dan Donasi', icon: <HiOutlineArchiveBox className="w-5 h-5" />,
            items: [
                { name: 'Dashboard Program', path: `${basePath}/donasi/dashboard` },
                { name: 'Data Program', path: `${basePath}/donasi/program` },
            ],
        },
        {
            id: 'rehabilitasi', title: 'Rehabilitasi', icon: <HiOutlineBookmark className="w-5 h-5" />,
            items: [
                { name: 'Program APBD', path: `${basePath}/rehabilitasi/program-apbd` },
                { name: 'Validasi CSR', path: `${basePath}/rehabilitasi/validasi-csr` },
                // { name: 'Verifikasi Dana CSR', path: `${basePath}/rehabilitasi/verifikasi-dana-csr` },
                // { name: 'Riwayat Keputusan Validasi', path: `${basePath}/rehabilitasi/riwayat-keputusan` },
                { name: 'Laporan Dana', path: `${basePath}/rehabilitasi/laporan-dana` },
                { name: 'Riwayat Rehabilitasi', path: `${basePath}/rehabilitasi/riwayat-rehabilitasi` },
            ],
        },
        {
            id: 'monitoring',
            title: 'Pelaksanaan dan Monitoring Program',
            icon: <HiOutlineComputerDesktop className="w-5 h-5" />,
            items: [
                { name: 'Dashboard', path: `${basePath}/monitoring/dashboard` },
                // { name: 'Penugasan Kegiatan Rehabilitasi ', path: `${basePath}/monitoring/penugasan-pelaksanaan` },
                // { name: 'Pelaksanaan Kegiatan Rehabilitasi', path: `${basePath}/monitoring/kegiatan` },
                // { name: 'Hasil Validasi Lokasi', path: `${basePath}/monitoring/hasil-validasi-lokasi` },
                // { name: 'Monitoring Program Rehabilitasi', path: `${basePath}/monitoring/verifikasi` },
            ],
        },
        {
            id: 'evaluasi', title: 'Evaluasi Penanaman Bibit', icon: <HiOutlineGlobeAlt className="w-5 h-5" />,
            items: [
                { name: 'Penugasan Evaluasi', path: `${basePath}/evaluasi/penugasan` },
               // { name: 'Validasi Data Evaluasi', path: `${basePath}/evaluasi/validasi-evaluasi` },
                { name: 'Laporan Evaluasi', path: `${basePath}/evaluasi/laporan` },
            ],
        },
        ...(userRole === ROLES.KABID || canManageAccounts(user) ? [menuManajemenAkun] : [])
    ];

    // CSR
    const csrMenus = [
        dashboard,
        { name: 'Tinjau Proposal', path: `${basePath}/tinjau-proposal`, icon: <HiOutlineDocumentText className="w-5 h-5" /> },
        { name: 'Riwayat Pendanaan', path: `${basePath}/riwayat-pendanaan`, icon: <HiOutlineClock className="w-5 h-5" /> },
        { name: 'Monitoring Proyek', path: `${basePath}/monitoring-proyek`, icon: <HiOutlineChartPie className="w-5 h-5" /> },
        { name: 'Laporan Realisasi Dana', path: `${basePath}/laporan-keuangan`, icon: <HiOutlineChartPie className="w-5 h-5" /> },
    ];

    // STAFF BUPM & KABID BUPM
    const bupmMenus = [
        dashboard,
        { name: 'Data Investasi', path: `${basePath}/data-investasi`, icon: <HiOutlineBanknotes className="w-5 h-5" /> },
        { name: 'Data Investor', path: `${basePath}/data-investor`, icon: <HiOutlineUsers className="w-5 h-5" /> },
        { name: 'Laporan Proyek', path: `${basePath}/laporan-proyek`, icon: <HiOutlineDocumentChartBar className="w-5 h-5" /> },
        { name: 'Laporan Keuangan', path: `${basePath}/laporan-keuangan`, icon: <HiOutlineDocumentChartBar className="w-5 h-5" /> },
    ];

    // PENYULUH
    const penyuluhMenus = [
        dashboard,
        { name: 'Validasi Lokasi', path: `${basePath}/validasi-lokasi`, icon: <HiOutlineMapPin className="w-5 h-5" /> },
        { name: 'Pelaksanaan Kegiatan', path: `${basePath}/pelaksanaan-penanaman`, icon: <HiOutlineSparkles className="w-5 h-5" /> },
        // { name: 'Monitoring Program Rehabilitasi', path: `${basePath}/monitoring-program`, icon: <HiOutlineEye className="w-5 h-5" /> },
        { name: 'Monitoring Program', path: `${basePath}/monitoring-lanjutan`, icon: <HiOutlineEye className="w-5 h-5" /> },
    ];

    // KELOMPOK TANI HUTAN (KTH)
    const kthMenus = [
        dashboard,
        {
            id: 'rehabilitasi-kth', title: 'Rehabilitasi', icon: <HiOutlineMap className="w-5 h-5" />,
            items: [
                { name: 'Pendanaan CSR', path: `${basePath}/rehabilitasi/pendanaan-csr` },
                { name: 'Pendanaan APBD', path: `${basePath}/rehabilitasi/pendanaan-apbd` },
                // { name: 'Update Progres', path: `${basePath}/rehabilitasi/update-progres` },
                { name: 'Laporan Dana', path: `${basePath}/rehabilitasi/laporan-dana` },
                { name: 'Riwayat Pendanaan', path: `${basePath}/rehabilitasi/riwayat` },
            ],
        },
        {
            id: 'investasi-kth', title: 'Investasi', icon: <HiOutlinePresentationChartLine className="w-5 h-5" />,
            items: [
                { name: 'Data Investasi', path: `${basePath}/investasi/data` },
                { name: 'Persetujuan Investor', path: `${basePath}/investasi/persetujuan` },
                { name: 'Data Investor', path: `${basePath}/investasi/investor` },
            ],
        },
        {
            id: 'laporan-investasi-kth', title: 'Laporan Investasi', icon: <HiOutlineChartPie className="w-5 h-5" />,
            items: [
                // { name: 'Laporan Usaha', path: `${basePath}/laporan-investasi/usaha` },
                { name: 'Laporan Proyek', path: `${basePath}/laporan-investasi/laporan-proyek` },
                { name: 'Laporan Keuangan', path: `${basePath}/laporan-investasi/keuangan` },
                // { name: 'Biaya Pengeluaran', path: `${basePath}/laporan-investasi/pengeluaran` },
                // { name: 'Biaya Pemasukan', path: `${basePath}/laporan-investasi/pemasukan` },
            ],
        },
        { name: 'Saldo Pendanaan', path: `${basePath}/saldo/keuntungan`, icon: <HiOutlineWallet className='w-5 h-5'/> }
    ];

    // KTH Pelaksanaan
    const kthPelaksanaanMenus = [
        dashboard,
    ];

    const MENU_MAP: Record<string, any[]> = {
        [ROLES.STAFF]: staffMenus,
        [ROLES.KABID]: kabidDanSuperadminMenus,
        [ROLES.SUPERADMIN]: kabidDanSuperadminMenus,
        [ROLES.CSR]: csrMenus,
        [ROLES.STAFFBUPM]: bupmMenus,
        [ROLES.KABIDBUPM]: bupmMenus,
        [ROLES.PENYULUH]: penyuluhMenus,
        [ROLES.KTH]: kthMenus,
        [ROLES.KTH_PELAKSANAAN]: kthPelaksanaanMenus,
    };

    return MENU_MAP[userRole] || MENU_MAP[ROLES.STAFF];
};