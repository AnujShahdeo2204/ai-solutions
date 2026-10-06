import React, { useState } from 'react';
import { Bell, Globe, Moon, User, Shield, Database } from 'lucide-react';

const SettingsPage = () => {
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  const [useMock, setUseMock] = useState(import.meta.env.VITE_USE_MOCK_API === 'true');

  const sections = [
    {
      title: 'API Configuration',
      icon: <Database size={20} />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Backend API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-accent"
            />
            <p className="text-xs text-secondary mt-1">Set via VITE_API_URL environment variable. Changes here are for display only.</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-primary">Mock API Mode</p>
              <p className="text-xs text-secondary">Currently using {useMock ? 'mock data' : 'live backend'}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${useMock ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {useMock ? 'Mock' : 'Live'}
            </span>
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
            <p className="text-sm text-primary">Currency Format</p>
            <select className="px-3 py-1.5 border border-border rounded-md text-sm focus:outline-none focus:border-accent">
              <option>₹ INR</option>
              <option>$ USD</option>
              <option>€ EUR</option>
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
        <p className="text-sm text-secondary mt-1">Manage your application preferences.</p>
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
