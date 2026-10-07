import React, { useState, useEffect } from 'react';
import { 
  Database, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  Layers,
  Box,
  Truck
} from 'lucide-react';
import { 
  ingestJson, 
  ingestCsv, 
  ingestXml, 
  seedDemoData, 
  getPipelineStatus, 
  checkBackendHealth, 
  getCurrencyRates,
  getCountries 
} from '../services/api';

const PipelinePage = () => {
  const [dbStats, setDbStats] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [logs, setLogs] = useState([]);
  
  // File inputs
  const [jsonFile, setJsonFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [xmlFile, setXmlFile] = useState(null);

  // External APIs
  const [currencyData, setCurrencyData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loadingCountries, setLoadingCountries] = useState(false);

  const addLog = (type, title, details) => {
    setLogs(prev => [
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        type, // 'success' | 'error' | 'info'
        title,
        details
      },
      ...prev.slice(0, 9)
    ]);
  };

  const refreshStatus = async () => {
    try {
      const health = await checkBackendHealth();
      setBackendOnline(health.online);
      if (health.online) {
        const statusRes = await getPipelineStatus();
        if (statusRes.success) {
          setDbStats(statusRes.data);
        }
      }
    } catch (e) {
      setBackendOnline(false);
    }
  };

  const loadExternalApis = async () => {
    try {
      const curr = await getCurrencyRates('INR');
      setCurrencyData(curr);
    } catch (e) {}

    try {
      setLoadingCountries(true);
      const c = await getCountries(selectedRegion);
      setCountries(c.slice(0, 8));
    } catch (e) {} finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    loadExternalApis();
  }, []);

  useEffect(() => {
    loadExternalApis();
  }, [selectedRegion]);

  const handleIngestJson = async () => {
    setLoadingAction('json');
    try {
      const res = await ingestJson(jsonFile || {});
      if (res.success) {
        addLog('success', 'JSON Ingestion Complete', `Processed ${res.ordersIngested || 0} orders. Rows normalized: ${res.normalizedRows || 0}`);
        refreshStatus();
      } else {
        addLog('error', 'JSON Ingestion Failed', res.error || 'Unknown error');
      }
    } catch (err) {
      addLog('error', 'JSON Ingestion Error', err.message);
    } finally {
      setLoadingAction('');
      setJsonFile(null);
    }
  };

  const handleIngestCsv = async () => {
    setLoadingAction('csv');
    try {
      const res = await ingestCsv(csvFile || '');
      if (res.success) {
        addLog('success', 'CSV Ingestion Complete', `Processed ${res.productsIngested || 0} products.`);
        refreshStatus();
      } else {
        addLog('error', 'CSV Ingestion Failed', res.error || 'Unknown error');
      }
    } catch (err) {
      addLog('error', 'CSV Ingestion Error', err.message);
    } finally {
      setLoadingAction('');
      setCsvFile(null);
    }
  };

  const handleIngestXml = async () => {
    setLoadingAction('xml');
    try {
      const res = await ingestXml(xmlFile || '');
      if (res.success) {
        addLog('success', 'XML Ingestion Complete', `Processed ${res.shipmentsIngested || 0} shipments.`);
        refreshStatus();
      } else {
        addLog('error', 'XML Ingestion Failed', res.error || 'Unknown error');
      }
    } catch (err) {
      addLog('error', 'XML Ingestion Error', err.message);
    } finally {
      setLoadingAction('');
      setXmlFile(null);
    }
  };

  const handleSeedDemo = async () => {
    setLoadingAction('seed');
    try {
      const res = await seedDemoData();
      if (res.success) {
        addLog('success', 'Rich Demo Dataset Seeded', `Populated ${res.rawOrders || 41} orders across 14 dates and 5 categories.`);
        refreshStatus();
      } else {
        addLog('error', 'Seed Failed', res.error);
      }
    } catch (err) {
      addLog('error', 'Seed Error', err.message);
    } finally {
      setLoadingAction('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Layers className="text-accent" /> Data Pipeline & Ingestion Engine
          </h2>
          <p className="text-sm text-secondary mt-1">
            ETL pipeline transforming JSON (Orders), CSV (Products), and XML (Shipments) into SQLite relational tables.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-surface">
            <span className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {backendOnline ? 'API Server Live (Port 5000)' : 'API Server Offline'}
          </div>
          <button
            onClick={refreshStatus}
            className="p-2 border border-border rounded-lg bg-surface text-secondary hover:text-primary hover:bg-slate-50 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Database State Banner */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <Database size={18} className="text-accent" /> Relational Storage Status (SQLite)
            </h3>
            <p className="text-xs text-secondary mt-0.5">Database: <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">backend/data/analytics.db</code> (WAL Mode)</p>
          </div>
          <button
            onClick={handleSeedDemo}
            disabled={loadingAction === 'seed'}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-95 disabled:opacity-50 transition-all shadow-sm"
          >
            <Sparkles size={16} />
            {loadingAction === 'seed' ? 'Seeding Dataset...' : 'Seed Rich Demo Dataset'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-border">
            <p className="text-xs font-medium text-secondary uppercase">Orders</p>
            <p className="text-xl font-bold text-primary mt-1">{dbStats?.orders ?? '-'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-border">
            <p className="text-xs font-medium text-secondary uppercase">Products</p>
            <p className="text-xl font-bold text-primary mt-1">{dbStats?.products ?? '-'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-border">
            <p className="text-xs font-medium text-secondary uppercase">Customers</p>
            <p className="text-xl font-bold text-primary mt-1">{dbStats?.customers ?? '-'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-border">
            <p className="text-xs font-medium text-secondary uppercase">Shipments</p>
            <p className="text-xl font-bold text-primary mt-1">{dbStats?.shipments ?? '-'}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-lg border border-border">
            <p className="text-xs font-medium text-secondary uppercase">Order Items</p>
            <p className="text-xl font-bold text-primary mt-1">{dbStats?.orderItems ?? '-'}</p>
          </div>
        </div>
      </div>

      {/* Ingestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* JSON Orders */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                JSON
              </span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">Orders Endpoint</span>
            </div>
            <h4 className="text-base font-semibold text-primary mb-1">Nested JSON Ingestion</h4>
            <p className="text-xs text-secondary mb-4 leading-relaxed">
              Flattens nested orders + items, sanitizes double-quoted JSON strings, and extracts customer objects.
            </p>
            
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-4 hover:border-accent transition-colors">
              <input
                type="file"
                accept=".json"
                id="json-file-input"
                className="hidden"
                onChange={(e) => setJsonFile(e.target.files[0])}
              />
              <label htmlFor="json-file-input" className="cursor-pointer block">
                <Upload size={20} className="mx-auto text-secondary mb-1" />
                <p className="text-xs font-medium text-primary">
                  {jsonFile ? jsonFile.name : 'Upload Orders.json'}
                </p>
                <p className="text-[11px] text-secondary">or trigger default baseline</p>
              </label>
            </div>
          </div>

          <button
            onClick={handleIngestJson}
            disabled={loadingAction === 'json'}
            className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loadingAction === 'json' ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            Ingest JSON (/api/ingest/json)
          </button>
        </div>

        {/* CSV Products */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                CSV
              </span>
              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">Products Endpoint</span>
            </div>
            <h4 className="text-base font-semibold text-primary mb-1">Products CSV Parser</h4>
            <p className="text-xs text-secondary mb-4 leading-relaxed">
              Handles outer quotes, strips BOM headers, validates ProductID/Category columns, and handles data types.
            </p>
            
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-4 hover:border-emerald-500 transition-colors">
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={(e) => setCsvFile(e.target.files[0])}
              />
              <label htmlFor="csv-file-input" className="cursor-pointer block">
                <Upload size={20} className="mx-auto text-secondary mb-1" />
                <p className="text-xs font-medium text-primary">
                  {csvFile ? csvFile.name : 'Upload Products.csv'}
                </p>
                <p className="text-[11px] text-secondary">or trigger default baseline</p>
              </label>
            </div>
          </div>

          <button
            onClick={handleIngestCsv}
            disabled={loadingAction === 'csv'}
            className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loadingAction === 'csv' ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            Ingest CSV (/api/ingest/csv)
          </button>
        </div>

        {/* XML Shipments */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                XML
              </span>
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">Shipments Endpoint</span>
            </div>
            <h4 className="text-base font-semibold text-primary mb-1">XML Shipment Parser</h4>
            <p className="text-xs text-secondary mb-4 leading-relaxed">
              Parses &lt;shipments&gt; tree, normalizes single vs array objects, calculates delay flags (&gt;5 days or Delayed).
            </p>
            
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-4 hover:border-amber-500 transition-colors">
              <input
                type="file"
                accept=".xml"
                id="xml-file-input"
                className="hidden"
                onChange={(e) => setXmlFile(e.target.files[0])}
              />
              <label htmlFor="xml-file-input" className="cursor-pointer block">
                <Upload size={20} className="mx-auto text-secondary mb-1" />
                <p className="text-xs font-medium text-primary">
                  {xmlFile ? xmlFile.name : 'Upload Shipment.xml'}
                </p>
                <p className="text-[11px] text-secondary">or trigger default baseline</p>
              </label>
            </div>
          </div>

          <button
            onClick={handleIngestXml}
            disabled={loadingAction === 'xml'}
            className="w-full py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {loadingAction === 'xml' ? <RefreshCw size={14} className="animate-spin" /> : <ArrowRight size={14} />}
            Ingest XML (/api/ingest/xml)
          </button>
        </div>
      </div>

      {/* Activity Log & External APIs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Logs */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            <FileText size={18} className="text-secondary" /> Ingestion Activity Log
          </h3>
          {logs.length === 0 ? (
            <div className="p-8 text-center text-secondary border border-dashed rounded-lg">
              <p className="text-sm">No recent pipeline activity.</p>
              <p className="text-xs text-slate-400 mt-1">Run an ingestion above to view live processing logs.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {logs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 border border-border rounded-lg flex items-start gap-3 text-sm">
                  {log.type === 'success' ? (
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-primary">{log.title}</p>
                      <span className="text-[11px] text-secondary">{log.time}</span>
                    </div>
                    <p className="text-xs text-secondary mt-0.5">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* External API Integration Showcase */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-semibold text-primary mb-4 flex items-center gap-2">
            <Globe size={18} className="text-accent" /> External API Integrations
          </h3>

          {/* Currency conversion card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-blue-600" />
                <span className="text-xs font-semibold uppercase text-blue-900 tracking-wider">Frankfurter Currency API</span>
              </div>
              <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Live Rates</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-white p-2 rounded border border-blue-100 text-center">
                <span className="text-[10px] text-secondary uppercase font-semibold">1 INR → EUR</span>
                <p className="text-sm font-bold text-primary mt-0.5">€{currencyData?.rates?.EUR?.toFixed(4) || '0.0092'}</p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100 text-center">
                <span className="text-[10px] text-secondary uppercase font-semibold">1 INR → USD</span>
                <p className="text-sm font-bold text-primary mt-0.5">${currencyData?.rates?.USD?.toFixed(4) || '0.0120'}</p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100 text-center">
                <span className="text-[10px] text-secondary uppercase font-semibold">Base</span>
                <p className="text-sm font-bold text-primary mt-0.5">INR (₹)</p>
              </div>
            </div>
          </div>

          {/* REST Countries API */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase text-secondary tracking-wider">REST Countries Demographic API</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="text-xs border border-border rounded px-2 py-1 bg-white text-primary"
              >
                <option value="">All Regions</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>
            {loadingCountries ? (
              <div className="p-4 text-center text-xs text-secondary animate-pulse">Loading demographic data...</div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {countries.map(c => (
                  <div key={c.name} className="flex items-center justify-between p-2 bg-slate-50 border border-border rounded text-xs">
                    <span className="font-medium text-primary">{c.name}</span>
                    <span className="text-secondary">{c.region}</span>
                    <span className="font-semibold text-primary">{(c.population / 1000000).toFixed(1)}M pop</span>
                    <span className="text-accent font-medium">{c.currencies}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
