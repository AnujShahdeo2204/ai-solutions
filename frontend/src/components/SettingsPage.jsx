import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { getApiUrl, setApiUrl, getUseMock, setUseMock, checkBackendHealth, DEFAULT_API_URL } from '../services/api';

const SettingsPage = () => {
  const [apiUrl, setLocalApiUrl] = useState(getApiUrl());
  const [useMock, setLocalUseMock] = useState(getUseMock());
  const [backendStatus, setBackendStatus] = useState({ checking: true, online: false, message: '' });

  const testConnection = async (urlToTest) => {
    const url = urlToTest !== undefined ? urlToTest : apiUrl;
    
    if (!url || !url.trim()) {
      setBackendStatus({ checking: false, online: false, error: 'API URL is empty. Please enter a valid URL.' });
      return;
    }

    setBackendStatus({ checking: true, online: false, error: '' });
    const res = await checkBackendHealth(url);
    if (res.online) {
      setBackendStatus({ checking: false, online: true, details: res.data });
    } else {
      setBackendStatus({ checking: false, online: false, error: res.error });
    }
  };

  useEffect(() => {
    testConnection(apiUrl);
  }, []);

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setLocalApiUrl(val);

    if (!val || !val.trim()) {
      // Immediately reflect offline when erased
      setBackendStatus({ checking: false, online: false, error: 'API URL is empty. Please enter a valid URL.' });
    }
  };

  const handleSaveAndTest = () => {
    setApiUrl(apiUrl);
    testConnection(apiUrl);
  };

  const handleResetDefault = () => {
    setLocalApiUrl(DEFAULT_API_URL);
    setApiUrl(DEFAULT_API_URL);
    testConnection(DEFAULT_API_URL);
  };

  const handleToggleMock = () => {
    const nextVal = !useMock;
    setLocalUseMock(nextVal);
    setUseMock(nextVal);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Settings</h2>
        <p className="text-sm text-secondary mt-1">Configure your backend connection and data source.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <span className="text-secondary"><Database size={20} /></span>
          <h3 className="text-base font-semibold text-primary">API Configuration & Data Source</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* API URL Input */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Backend REST API URL</label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder="http://localhost:5000/api"
                value={apiUrl}
                onChange={handleUrlChange}
                className="flex-1 px-3.5 py-2.5 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAndTest}
                  disabled={backendStatus.checking}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-colors shrink-0"
                >
                  <RefreshCw size={14} className={backendStatus.checking ? 'animate-spin' : ''} />
                  Test & Save
                </button>
                <button
                  onClick={handleResetDefault}
                  title="Reset to default URL"
                  className="p-2.5 border border-border rounded-lg text-secondary hover:text-primary hover:bg-slate-50 transition-colors shrink-0"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Live Connection Status Badge */}
            <div className="mt-3">
              {backendStatus.checking ? (
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Pinging {apiUrl || '(empty URL)'}...
                </div>
              ) : backendStatus.online ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Connected to Backend</p>
                    <p className="text-emerald-700 mt-0.5 font-mono">
                      {apiUrl} — SQLite Database Active ({backendStatus.details?.stats?.orders ?? 0} orders loaded)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
                  <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Disconnected</p>
                    <p className="text-rose-700 mt-0.5">
                      {backendStatus.error || 'Unable to connect to the specified API URL.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mock vs Live Toggle Card */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-border">
            <div>
              <p className="text-sm font-semibold text-primary">Data Source Mode</p>
              <p className="text-xs text-secondary mt-0.5">
                {useMock 
                  ? 'Currently serving data from built-in mock simulator' 
                  : 'Currently querying live Node.js / Express SQLite backend'}
              </p>
            </div>
            <button
              onClick={handleToggleMock}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                useMock 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
              }`}
            >
              {useMock ? 'Using Mock Data (Switch to Live)' : 'Using Live SQLite (Switch to Mock)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
