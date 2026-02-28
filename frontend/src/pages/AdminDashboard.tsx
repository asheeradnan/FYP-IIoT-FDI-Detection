import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  XCircle,
  Clock,
  LogOut,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
  TrendingUp,
  Zap,
  Server,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/api';

interface PendingUser {
  id: number;
  email: string;
  full_name: string;
  organization?: string;
  created_at: string;
}

interface Analytics {
  total_users: number;
  pending_users: number;
  total_anomalies: number;
  anomalies_today: number;
  attack_types?: { [key: string]: number };
}

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, analyticsResponse] = await Promise.all([
        adminService.getPendingUsers(),
        adminService.getAnalytics()
      ]);
      setPendingUsers(usersResponse);
      setAnalytics(analyticsResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set demo data for development
      setAnalytics({
        total_users: 24,
        pending_users: 3,
        total_anomalies: 156,
        anomalies_today: 12,
        attack_types: { 'FDI Attack': 45, 'DoS': 32, 'Replay': 28, 'Spoofing': 51 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(userId);
      await adminService.updateUserStatus(userId, action === 'approve' ? 'approved' : 'rejected');
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      if (analytics) {
        setAnalytics({
          ...analytics,
          pending_users: analytics.pending_users - 1,
          total_users: action === 'approve' ? analytics.total_users + 1 : analytics.total_users
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const menuItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'alerts', icon: Bell, label: 'Alerts & Threats' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Modern Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">IIoT Security</h1>
                  <p className="text-xs text-slate-400">Admin Console</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-white" />
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'users' && pendingUsers.length > 0 && (
                    <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingUsers.length}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-700/50">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 mt-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'overview' && '📊 Dashboard Overview'}
                {activeTab === 'users' && '👥 User Management'}
                {activeTab === 'alerts' && '🚨 Alerts & Threats'}
                {activeTab === 'analytics' && '📈 Analytics'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h1>
              <p className="text-sm text-slate-400 mt-1">{currentDate}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              {/* Refresh Button */}
              <button 
                onClick={fetchData}
                className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                  {analytics?.anomalies_today || 0}
                </span>
              </button>

              {/* Time Display */}
              <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
                <p className="text-cyan-400 font-mono font-bold">{currentTime}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-spin border-t-cyan-500"></div>
                <Shield className="absolute inset-0 m-auto w-6 h-6 text-cyan-500" />
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users Card */}
                    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-cyan-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-cyan-400" />
                          </div>
                          <span className="flex items-center gap-1 text-emerald-400 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            +12%
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Total Users</p>
                        <p className="text-4xl font-bold text-white mt-1">{analytics?.total_users || 0}</p>
                        <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Pending Approvals Card */}
                    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-amber-500/20 rounded-xl">
                            <Clock className="w-6 h-6 text-amber-400" />
                          </div>
                          {(analytics?.pending_users || 0) > 0 && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full animate-pulse">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Pending Approvals</p>
                        <p className="text-4xl font-bold text-white mt-1">{analytics?.pending_users || 0}</p>
                        <button 
                          onClick={() => setActiveTab('users')}
                          className="mt-4 flex items-center gap-2 text-amber-400 text-sm hover:gap-3 transition-all"
                        >
                          Review now <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total Anomalies Card */}
                    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-red-500/20 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          </div>
                          <span className="flex items-center gap-1 text-red-400 text-sm">
                            <Activity className="w-4 h-4" />
                            Live
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Total Anomalies</p>
                        <p className="text-4xl font-bold text-white mt-1">{analytics?.total_anomalies || 0}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                          <span className="text-xs text-slate-400">Monitoring active</span>
                        </div>
                      </div>
                    </div>

                    {/* Today's Alerts Card */}
                    <div className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Zap className="w-6 h-6 text-emerald-400" />
                          </div>
                          <span className="text-slate-400 text-xs">Last 24h</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Today's Alerts</p>
                        <p className="text-4xl font-bold text-white mt-1">{analytics?.anomalies_today || 0}</p>
                        <div className="mt-4 flex gap-1">
                          {[...Array(7)].map((_, i) => (
                            <div 
                              key={i}
                              className="flex-1 h-8 bg-slate-700 rounded-sm overflow-hidden"
                            >
                              <div 
                                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400"
                                style={{ height: `${Math.random() * 100}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attack Distribution & System Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attack Distribution */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Attack Distribution</h3>
                        <select className="bg-slate-700 text-slate-300 text-sm rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:border-cyan-500">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>All time</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {analytics?.attack_types && Object.entries(analytics.attack_types).map(([type, count], index) => {
                          const colors = [
                            'from-red-500 to-orange-500',
                            'from-purple-500 to-pink-500',
                            'from-cyan-500 to-blue-500',
                            'from-emerald-500 to-teal-500'
                          ];
                          const attackTypes = analytics.attack_types || {};
                          const total = Object.values(attackTypes).reduce((a, b) => a + b, 0);
                          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                          
                          return (
                            <div key={type} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center mb-3`}>
                                <AlertTriangle className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-2xl font-bold text-white">{count}</p>
                              <p className="text-sm text-slate-400 capitalize">{type.replace('_', ' ')}</p>
                              <div className="mt-2 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{percentage}% of total</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                      <h3 className="text-lg font-semibold text-white mb-6">System Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                              <Zap className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-slate-300 text-sm">DQN-GNN Model</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-emerald-400">Running</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                              <Server className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-slate-300 text-sm">Database</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span className="text-xs text-cyan-400">Connected</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                              <Activity className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-slate-300 text-sm">API Server</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs text-emerald-400">Online</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/20">
                              <Bell className="w-4 h-4 text-amber-400" />
                            </div>
                            <span className="text-slate-300 text-sm">Alert System</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs text-amber-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Users Quick View */}
                  {pendingUsers.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Pending User Approvals</h3>
                            <p className="text-sm text-slate-400">{pendingUsers.length} users waiting for approval</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('users')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          View All <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pendingUsers.slice(0, 3).map(pendingUser => (
                          <div key={pendingUser.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold">
                                {pendingUser.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Pending</span>
                            </div>
                            <p className="font-medium text-white truncate">{pendingUser.full_name}</p>
                            <p className="text-sm text-slate-400 truncate">{pendingUser.email}</p>
                            <p className="text-xs text-slate-500 mt-1">{pendingUser.organization}</p>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleUserAction(pendingUser.id, 'approve')}
                                disabled={actionLoading === pendingUser.id}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm"
                              >
                                <CheckCircle className="w-4 h-4" /> Approve
                              </button>
                              <button
                                onClick={() => handleUserAction(pendingUser.id, 'reject')}
                                disabled={actionLoading === pendingUser.id}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Header with Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">User Management</h2>
                      <p className="text-slate-400 text-sm">Manage user registrations and access control</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                      </button>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {pendingUsers.length === 0 ? (
                      <div className="p-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                        <p className="text-slate-400">No pending user requests at the moment.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700/50">
                              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">User</th>
                              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Organization</th>
                              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Applied On</th>
                              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Status</th>
                              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {pendingUsers.map(pendingUser => (
                              <tr key={pendingUser.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                      {pendingUser.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-medium text-white">{pendingUser.full_name}</p>
                                      <p className="text-sm text-slate-400">{pendingUser.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-slate-300">{pendingUser.organization}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-slate-400">{new Date(pendingUser.created_at).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                                    Pending Review
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleUserAction(pendingUser.id, 'approve')}
                                      disabled={actionLoading === pendingUser.id}
                                      className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                                    >
                                      {actionLoading === pendingUser.id ? (
                                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-5 h-5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleUserAction(pendingUser.id, 'reject')}
                                      disabled={actionLoading === pendingUser.id}
                                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                      <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                      <MoreVertical className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-10 h-10 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Real-time Alert Monitoring</h3>
                      <p className="text-slate-400 mb-6">Advanced threat detection powered by DQN-GNN model</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          System Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                      <p className="text-slate-400">Detailed reports and insights coming soon...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">System Settings</h3>
                      <p className="text-slate-400">Configuration options coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
