import React, { useState, useEffect } from 'react';
import { Bell, Globe, Moon, User, Shield, Database, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { getUseMock, setUseMock, checkBackendHealth } from '../services/api';

const SettingsPage = () => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  const [useMock, setLocalUseMock] = useState(getUseMock());
  const [backendStatus, setBackendStatus] = useState({ checking: true, online: false });

  const testConnection = async () => {
    setBackendStatus({ checking: true, online: false });
    const res = await checkBackendHealth();
    setBackendStatus({ checking: false, online: res.online, details: res.data });
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleToggleMock = () => {
    const nextVal = !useMock;
    setLocalUseMock(nextVal);
    setUseMock(nextVal);
  };

  const sections = [
    {
      title: 'API Configuration & Data Source',
      icon: <Database size={20} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Backend API URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
              />
              <button
                onClick={testConnection}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={backendStatus.checking ? 'animate-spin' : ''} />
                Test Connection
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {backendStatus.checking ? (
                <span className="text-xs text-secondary">Checking backend connection...</span>
              ) : backendStatus.online ? (
                <span className="text-xs text-green-700 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={13} /> Live backend online at {apiUrl}
                </span>
              ) : (
                <span className="text-xs text-amber-700 flex items-center gap-1 font-medium">
                  <XCircle size={13} /> Backend not detected at {apiUrl} (Switch to Mock mode or start backend on port 5000)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-primary">Mock Data vs. Live Backend</p>
              <p className="text-xs text-secondary mt-0.5">
                {useMock 
                  ? 'Currently serving data from local simulated mock generator' 
                  : 'Currently querying live Node.js / Express SQLite backend'}
              </p>
            </div>
            <button
              onClick={handleToggleMock}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                useMock 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' 
                  : 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
              }`}
            >
              {useMock ? 'Using Mock API (Click for Live)' : 'Using Live Backend (Click for Mock)'}
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Notifications',
      icon: <Bell size={20} />,
      content: (
        <div className="space-y-3">
          {['Email notifications', 'Push notifications', 'Order alerts', 'Delivery delay alerts'].map(label => (
            <div key={label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
              <p className="text-sm text-primary">{label}</p>
              <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Appearance',
      icon: <Moon size={20} />,
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
            <p className="text-sm text-primary">Theme</p>
            <select className="px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
            <p className="text-sm text-primary">Primary Currency</p>
            <select className="px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent">
              <option>₹ INR (Indian Rupee)</option>
              <option>$ USD (US Dollar)</option>
              <option>€ EUR (Euro)</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: 'Profile',
      icon: <User size={20} />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-secondary">
              <User size={28} />
            </div>
            <div>
              <p className="font-medium text-primary">Admin User</p>
              <p className="text-sm text-secondary">admin@analytics.pro</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Full Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input type="email" defaultValue="admin@analytics.pro" className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <p className="text-sm text-secondary mt-1">Manage your application preferences and data source.</p>
      </div>

      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.title} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center gap-3">
              <span className="text-secondary">{section.icon}</span>
              <h3 className="text-base font-semibold text-primary">{section.title}</h3>
            </div>
            <div className="p-5">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
