import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  Home,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStats, type AdminStats } from '../../services/adminService';
import { formatVND } from '../../utils/currency';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch admin stats', error);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F3F3] font-sans text-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-brand-dark/60 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F3F3] font-sans text-slate-800">
      <div className="min-h-screen bg-brand-bg pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left - User Info */}
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-purple-600/20 overflow-hidden ring-4 ring-white">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user?.fullName || 'Admin'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      user?.fullName?.charAt(0) || 'A'
                    )}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-black text-brand-dark">
                      {user?.fullName || 'Admin Dashboard'}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full">
                      <Users className="w-3.5 h-3.5" />
                      Admin
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium">{user?.email}</p>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="px-5 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Users */}
            <StatCard
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              value={stats?.totalUsers || 0}
              label="Total Users"
              subtitle={`${stats?.totalCustomers || 0} customers, ${stats?.totalHosts || 0} hosts`}
            />

            {/* Total Hotels */}
            <StatCard
              icon={Building2}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
              value={stats?.totalHotels || 0}
              label="Total Hotels"
              subtitle={`${stats?.totalRooms || 0} rooms`}
            />

            {/* Total Bookings */}
            <StatCard
              icon={Calendar}
              iconColor="text-green-600"
              iconBg="bg-green-50"
              value={stats?.totalBookings || 0}
              label="Total Bookings"
              subtitle="All time"
            />

            {/* Total Revenue */}
            <StatCard
              icon={DollarSign}
              iconColor="text-orange-600"
              iconBg="bg-orange-50"
              value={formatVND(parseFloat(stats?.totalRevenue || '0'), { symbol: 'VND' })}
              label="Total Revenue"
              subtitle={`${formatVND(parseFloat(stats?.thisMonthRevenue || '0'), { symbol: 'VND' })} this month`}
            />
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-black text-slate-900 mb-6">Platform Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{stats?.totalCustomers || 0}</p>
                <p className="text-sm text-slate-500 font-medium">Customers</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">{stats?.totalHosts || 0}</p>
                <p className="text-sm text-slate-500 font-medium">Hosts</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900">
                  {formatVND(parseFloat(stats?.thisMonthRevenue || '0'), { symbol: 'VND' })}
                </p>
                <p className="text-sm text-slate-500 font-medium">This Month Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
  subtitle: string | React.ReactNode;
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-1">{value}</h3>
      <p className="text-slate-500 font-medium text-sm">{label}</p>
      {typeof subtitle === 'string' ? (
        <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
      ) : (
        <div className="mt-2">{subtitle}</div>
      )}
    </div>
  );
}

