import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Bell,
  LogOut,
  BarChart3,
  Network,
  Gauge,
  Menu,
  X,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { modelService } from '../services/api';

interface SensorData {
  sensor_id: string;
  value: number;
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

interface TopologyNode {
  id: string;
  type: 'sensor' | 'plc' | 'hmi' | 'server';
  name: string;
  status: 'online' | 'offline' | 'alert';
  x: number;
  y: number;
}

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [topologyData, setTopologyData] = useState<TopologyNode[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [topology] = await Promise.all([
        modelService.getTopology()
      ]);
      setTopologyData(topology.nodes || []);
      
      // Generate mock sensor data for demo
      setSensorData([
        { sensor_id: 'LIT101', value: 523.4, threshold: 800, status: 'normal' },
        { sensor_id: 'LIT301', value: 756.2, threshold: 800, status: 'warning' },
        { sensor_id: 'FIT101', value: 2.34, threshold: 3.0, status: 'normal' },
        { sensor_id: 'AIT201', value: 245.8, threshold: 260, status: 'warning' },
        { sensor_id: 'PIT501', value: 15.2, threshold: 20, status: 'normal' },
        { sensor_id: 'FIT501', value: 1.89, threshold: 2.5, status: 'normal' },
      ]);

      setRecentAlerts([
        { id: 1, type: 'FDI Attack', sensor: 'LIT301', time: '2 min ago', severity: 'high' },
        { id: 2, type: 'Threshold Breach', sensor: 'AIT201', time: '15 min ago', severity: 'medium' },
        { id: 3, type: 'Anomaly Detected', sensor: 'FIT101', time: '1 hour ago', severity: 'low' },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': case 'online': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': case 'alert': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-sky-400" />
              <span className="font-bold text-lg">IIoT Security</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'sensors', icon: Gauge, label: 'Sensors' },
            { id: 'topology', icon: Network, label: 'Network Topology' },
            { id: 'alerts', icon: Bell, label: 'Alerts' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-sky-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.full_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                <Activity className="w-4 h-4" />
                System Online
              </div>
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                {recentAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {recentAlerts.length}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Active Sensors</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">{sensorData.length}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-sky-500">
                          <Gauge className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Warnings</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {sensorData.filter(s => s.status === 'warning').length}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500">
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {recentAlerts.filter(a => a.severity === 'high').length}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Detection Rate</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">98.5%</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-500">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sensor Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Status</h3>
                      <div className="space-y-3">
                        {sensorData.map(sensor => (
                          <div key={sensor.sensor_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`} />
                              <span className="font-medium text-gray-900">{sensor.sensor_id}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{sensor.value}</p>
                              <p className="text-xs text-gray-500">Threshold: {sensor.threshold}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                      <div className="space-y-3">
                        {recentAlerts.map(alert => (
                          <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{alert.type}</p>
                                <p className="text-sm opacity-75">Sensor: {alert.sensor}</p>
                              </div>
                              <div className="flex items-center gap-1 text-sm opacity-75">
                                <Clock className="w-4 h-4" />
                                {alert.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sensors' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Sensor Monitoring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sensorData.map(sensor => (
                      <div key={sensor.sensor_id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{sensor.sensor_id}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sensor.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                            sensor.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sensor.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Current Value</p>
                            <p className="text-2xl font-bold text-gray-900">{sensor.value}</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getStatusColor(sensor.status)}`}
                              style={{ width: `${Math.min((sensor.value / sensor.threshold) * 100, 100)}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-500">Threshold: {sensor.threshold}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'topology' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">IIoT Network Topology</h3>
                  <div className="relative bg-slate-900 rounded-xl p-8 min-h-[500px]">
                    {/* Network Visualization Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Network topology visualization</p>
                        <p className="text-slate-500 text-sm mt-2">Interactive diagram coming soon</p>
                      </div>
                    </div>
                    
                    {/* Simple Node Display */}
                    <div className="relative z-10 grid grid-cols-4 gap-4">
                      {[
                        { name: 'HMI Server', type: 'server', status: 'online' },
                        { name: 'PLC 1', type: 'plc', status: 'online' },
                        { name: 'PLC 2', type: 'plc', status: 'online' },
                        { name: 'PLC 3', type: 'plc', status: 'alert' },
                        { name: 'LIT101', type: 'sensor', status: 'online' },
                        { name: 'LIT301', type: 'sensor', status: 'alert' },
                        { name: 'FIT101', type: 'sensor', status: 'online' },
                        { name: 'AIT201', type: 'sensor', status: 'online' },
                      ].map((node, idx) => (
                        <div key={idx} className="bg-slate-800 rounded-lg p-4 text-center">
                          <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${getStatusColor(node.status)}`} />
                          <p className="text-white text-sm font-medium">{node.name}</p>
                          <p className="text-slate-400 text-xs capitalize">{node.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Alert History</h3>
                    <p className="text-sm text-gray-500">View all security alerts and anomalies</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentAlerts.map(alert => (
                      <div key={alert.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              alert.severity === 'high' ? 'bg-red-100' :
                              alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                            }`}>
                              <AlertTriangle className={`w-5 h-5 ${
                                alert.severity === 'high' ? 'text-red-600' :
                                alert.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{alert.type}</p>
                              <p className="text-sm text-gray-500">Sensor: {alert.sensor}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                              alert.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
