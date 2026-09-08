import re

file_path = r"src\pages\StaffPDAS\EvaluasiPenanamanBibit\DashboardEvaluasi\DashboardEvaluasi.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add getMonitoringDashboardAPI import
if "import { getMonitoringDashboardAPI }" not in content:
    content = content.replace("import axios from 'axios';", "import axios from 'axios';\nimport { getMonitoringDashboardAPI } from '@/services/penugasan.service';")

# Add mapMarkers state
if "mapMarkers" not in content:
    state_replacement = """    const [stats, setStats] = useState({
        total_target_bibit: 0,
        total_bibit_hidup: 0,
        rata_rata_persentase_tumbuh: 0,
        pu_gagal: 0
    });
    const [mapMarkers, setMapMarkers] = useState<any[]>([]);"""
    content = re.sub(r'const \[stats, setStats\] = useState\(\{[\s\S]*?pu_gagal: 0\n    \}\);', state_replacement, content)

# Fetch mapMarkers
if "getMonitoringDashboardAPI" in content and "setMapMarkers" in content and "getMonitoringDashboardAPI().then" not in content:
    fetch_replacement = """    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/evaluasi/dashboard-stats')
            .then(res => {
                if (res.data?.data) {
                    setStats(res.data.data);
                }
            })
            .catch(err => console.error("Error fetching evaluasi stats:", err));

        getMonitoringDashboardAPI()
            .then(res => {
                if (res?.map_markers) {
                    setMapMarkers(res.map_markers);
                }
            })
            .catch(err => console.error("Error fetching map markers:", err));
    }, []);"""
    content = re.sub(r'useEffect\(\(\) => \{[\s\S]*?\}\, \[\]\);', fetch_replacement, content)

# Pass mapMarkers to PetaKegiatanEvaluasi
content = content.replace("<PetaKegiatanEvaluasi />", "<PetaKegiatanEvaluasi markers={mapMarkers} />")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated DashboardEvaluasi.tsx successfully")
