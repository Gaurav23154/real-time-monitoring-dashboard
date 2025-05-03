import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Metric = {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold: {
    warning: number;
    danger: number;
  };
  trend: 'up' | 'down' | 'stable';
  history: { value: number; timestamp: string }[];
};

type Alert = {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'settings'>('dashboard');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock data
  useEffect(() => {
    const generateMockMetrics = (): Metric[] => {
      const now = new Date();
      return [
        {
          id: 'temperature',
          name: 'Server Temperature',
          value: Math.random() * 50 + 30,
          unit: '°C',
          threshold: { warning: 70, danger: 80 },
          trend: Math.random() > 0.5 ? 'up' : 'down',
          history: Array.from({ length: 24 }, (_, i) => ({
            value: Math.random() * 50 + 30,
            timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString().slice(11, 16),
          })),
        },
        {
          id: 'traffic',
          name: 'Network Traffic',
          value: Math.random() * 1000 + 500,
          unit: 'Mbps',
          threshold: { warning: 1200, danger: 1500 },
          trend: Math.random() > 0.5 ? 'up' : 'down',
          history: Array.from({ length: 24 }, (_, i) => ({
            value: Math.random() * 1000 + 500,
            timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString().slice(11, 16),
          })),
        },
        {
          id: 'visitors',
          name: 'Website Visitors',
          value: Math.floor(Math.random() * 5000 + 1000),
          unit: '',
          threshold: { warning: 4500, danger: 5000 },
          trend: Math.random() > 0.5 ? 'up' : 'down',
          history: Array.from({ length: 24 }, (_, i) => ({
            value: Math.floor(Math.random() * 5000 + 1000),
            timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString().slice(11, 16),
          })),
        },
        {
          id: 'response',
          name: 'API Response Time',
          value: Math.random() * 300 + 50,
          unit: 'ms',
          threshold: { warning: 250, danger: 300 },
          trend: Math.random() > 0.5 ? 'up' : 'down',
          history: Array.from({ length: 24 }, (_, i) => ({
            value: Math.random() * 300 + 50,
            timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString().slice(11, 16),
          })),
        },
      ];
    };

    const generateMockAlerts = (metrics: Metric[]): Alert[] => {
      const alertMessages = [
        'Threshold exceeded',
        'Unusual activity detected',
        'Performance degradation',
        'Resource utilization high',
        'Connection timeout',
      ];

      return metrics.flatMap(metric => {
        const shouldAlert = Math.random() > 0.7;
        if (!shouldAlert) return [];

        const severity = metric.value > metric.threshold.danger ? 'high' : 
                        metric.value > metric.threshold.warning ? 'medium' : 'low';
        
        return [{
          id: `${metric.id}-${Date.now()}`,
          message: `${alertMessages[Math.floor(Math.random() * alertMessages.length)]} for ${metric.name}`,
          severity,
          timestamp: new Date().toISOString(),
          resolved: false,
        }];
      });
    };

    const initialMetrics = generateMockMetrics();
    setMetrics(initialMetrics);
    setAlerts(generateMockAlerts(initialMetrics));
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedMetrics = generateMockMetrics();
      setMetrics(updatedMetrics);

      // Check for new alerts
      const newAlerts = generateMockAlerts(updatedMetrics);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const getStatusColor = (value: number, warning: number, danger: number) => {
    if (value >= danger) return 'bg-red-500';
    if (value >= warning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <span className="text-red-500">↑</span>;
      case 'down': return <span className="text-green-500">↓</span>;
      default: return <span className="text-gray-500">→</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-bold text-xl text-indigo-600"
              >
                MonitorPro
              </motion.div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'dashboard' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'alerts' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                Alerts
                {alerts.filter(a => !a.resolved).length > 0 && (
                  <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {alerts.filter(a => !a.resolved).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${activeTab === 'settings' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
              
              {/* Status Overview */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map(metric => (
                      <motion.div
                        key={metric.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-700">{metric.name}</h3>
                            <p className="text-2xl font-bold mt-2">
                              {metric.value.toFixed(metric.id === 'visitors' ? 0 : 1)}{metric.unit}
                            </p>
                          </div>
                          <div className={`h-4 w-4 rounded-full ${getStatusColor(metric.value, metric.threshold.warning, metric.threshold.danger)}`}></div>
                        </div>
                        <div className="mt-4 flex items-center">
                          {getTrendIcon(metric.trend)}
                          <span className="ml-2 text-sm text-gray-500">Last hour</span>
                        </div>
                        <div className="mt-2 h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metric.history.slice(-6)}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={metric.value > metric.threshold.danger ? '#ef4444' : 
                                       metric.value > metric.threshold.warning ? '#eab308' : '#10b981'} 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature Trend</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.find(m => m.id === 'temperature')?.history || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Traffic Distribution</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.find(m => m.id === 'traffic')?.history.slice(-12) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
                {alerts.length === 0 ? (
                  <p className="text-gray-500">No recent alerts</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map(alert => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-3 rounded-md border-l-4 ${alert.resolved ? 'border-gray-300 bg-gray-50' : 
                                  alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${alert.resolved ? 'text-gray-600' : 
                                         alert.severity === 'high' ? 'text-red-800' :
                                         alert.severity === 'medium' ? 'text-yellow-800' : 'text-blue-800'}`}>
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!alert.resolved && (
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="text-xs px-2 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
                    Filter
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                    Export
                  </button>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium text-gray-700">
                  <div className="col-span-6">Message</div>
                  <div className="col-span-2">Severity</div>
                  <div className="col-span-2">Time</div>
                  <div className="col-span-2">Status</div>
                </div>
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No alerts found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {alerts.map(alert => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-12 p-4 items-center hover:bg-gray-50"
                      >
                        <div className="col-span-6 font-medium">{alert.message}</div>
                        <div className="col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className="col-span-2 text-sm text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                        <div className="col-span-2 flex justify-between items-center">
                          <span className={`text-sm ${
                            alert.resolved ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {alert.resolved ? 'Resolved' : 'Active'}
                          </span>
                          {!alert.resolved && (
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="text-xs px-2 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Alert Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="critical-alerts"
                          name="critical-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="critical-alerts" className="ml-3 block text-sm font-medium text-gray-700">
                          Critical Alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="warning-alerts"
                          name="warning-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="warning-alerts" className="ml-3 block text-sm font-medium text-gray-700">
                          Warning Alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="info-alerts"
                          name="info-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="info-alerts" className="ml-3 block text-sm font-medium text-gray-700">
                          Informational Alerts
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Notification Methods</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                          Email Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="sms-notifications"
                          name="sms-notifications"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sms-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                          SMS Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="push-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                          Push Notifications
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-indigo-600">MonitorPro</span>
              <span className="ml-4 text-sm text-gray-500">© 2023 All rights reserved.</span>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <span className="text-sm">Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms</span>
                <span className="text-sm">Terms of Service</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;