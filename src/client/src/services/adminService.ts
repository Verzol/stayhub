import api from './api';

export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalHosts: number;
  totalHotels: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: string;
  thisMonthRevenue: string;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get<AdminStats>('/admin/stats');
  return response.data;
};

