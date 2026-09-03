export interface Report {
  id: string;
  status: 'Verified' | 'Pending';
  date: string;
  title: string;
  coordinates: string;
  groupName: string;
  details?: {
    latitude: string;
    longitude: string;
    accuracy: string;
    survivalRate: string;
    healthStatus: string;
    images: { before: string; during: string };
    kendala: string;
    verifiedBy?: string;
    verifiedAt?: string;
  };
}

export const mockReports: Report[] = [
  {
    id: 'm1',
    status: 'Verified',
    date: '15/4/2024',
    title: 'Penanaman Mangrove Pesisir',
    coordinates: '-6.2000, 107.8000',
    groupName: 'Kelompok Tani Hutan Lestari',
    details: {
      latitude: '-6.2',
      longitude: '107.8',
      accuracy: 'AKURASI TINGGI (3M)',
      survivalRate: '98%',
      healthStatus: 'SEHAT',
      images: {
        before: 'https://images.unsplash.com/photo-1542308075-8120ec2cfa76?w=400&q=80',
        during: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=400&q=80'
      },
      kendala: '"Tidak ada kendala berarti."',
      verifiedBy: 'Koordinator Lapangan',
      verifiedAt: '16/4/2024, 5:00:00 PM'
    }
  },
  {
    id: 'm2',
    status: 'Pending',
    date: '16/4/2024',
    title: 'Penanaman Mangrove Pesisir (Tahap 2)',
    coordinates: '-6.2010, 107.8015',
    groupName: 'Kelompok Tani Hutan Lestari',
    details: {
      latitude: '-6.2010',
      longitude: '107.8015',
      accuracy: 'AKURASI SEDANG (8M)',
      survivalRate: '95%',
      healthStatus: 'SEHAT',
      images: {
        before: 'https://images.unsplash.com/photo-1542308075-8120ec2cfa76?w=400&q=80',
        during: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=400&q=80'
      },
      kendala: '"Hujan deras sempat menunda penanaman selama 2 hari."'
    }
  }
];