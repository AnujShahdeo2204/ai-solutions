import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Check, 
  CheckCheck, 
  Settings, 
  LogOut, 
  Shield, 
  Mail, 
  Package, 
  Truck, 
  AlertTriangle, 
  TrendingUp,
  X, 
  ChevronRight, 
  Sparkles,
  UserCheck,
  Building,
  MapPin,
  Calendar,
  Volume2,
  VolumeX,
  RefreshCw
} from 'lucide-react';

const subtitles = {
  Dashboard: 'Monitor revenue, orders, categories and delivery performance.',
  Orders: 'View and manage all customer orders.',
  Products: 'Browse and manage the product catalog.',
  Analytics: 'Deep-dive into business performance metrics.',
  Delivery: 'Monitor shipment and delivery performance.',
  Pipeline: 'Ingest multi-format data (JSON, CSV, XML) and run transformation pipeline.',
  Settings: 'Manage your application preferences.',
};

const initialNotifications = [
  {
    id: 1,
    title: 'New High-Value Order',
    message: 'Order #1045 placed by TechCorp ($1,290.00)',
    time: '10 min ago',
    unread: true,
    type: 'order',
    route: 'Orders',
  },
  {
    id: 2,
    title: 'Delivery Shipment Update',
    message: 'Shipment #TRK-8821 delivered to Enterprise Solutions',
    time: '45 min ago',
    unread: true,
    type: 'delivery',
    route: 'Delivery',
  },
  {
    id: 3,
    title: 'Low Inventory Alert',
    message: 'Wireless Mechanical Keyboard inventory low (4 units left)',
    time: '2 hrs ago',
    unread: true,
    type: 'alert',
    route: 'Products',
  },
  {
    id: 4,
    title: 'Weekly Revenue Growth',
    message: 'Weekly sales exceeded target by +14.8% ($24.5k total)',
    time: '1 day ago',
    unread: false,
    type: 'analytics',
    route: 'Analytics',
  },
];

const Header = ({ currentRoute, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toastMessage, setToastMessage] = useState(null);

  const notificationsRef = useRef(null);
  const accountRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const markAsRead = (id, route) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setShowNotifications(false);
    if (route && onNavigate) {
      onNavigate(route);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package size={16} className="text-accent" />;
      case 'delivery':
        return <Truck size={16} className="text-success" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-warning" />;
      case 'analytics':
        return <TrendingUp size={16} className="text-blue-500" />;
      default:
        return <Bell size={16} className="text-secondary" />;
    }
  };

  return (
    <header className="relative h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-30">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-20 right-8 bg-slate-900 text-white text-xs md:text-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title and Subtitle */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <h2 className="text-xl font-semibold text-primary whitespace-nowrap">Order Analytics</h2>
        <span className="hidden md:inline-block text-sm text-secondary truncate">
          {subtitles[currentRoute] || ''}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notification Button & Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false);
            }}
            aria-label="Notifications"
            className={`relative p-2.5 transition-all rounded-lg ${
              showNotifications
                ? 'bg-slate-100 text-accent ring-2 ring-accent/20'
                : 'text-secondary hover:text-primary hover:bg-slate-100'
            }`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-surface animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3.5 bg-slate-50 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-primary">Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="text-[11px] bg-accent/10 text-accent font-medium px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-[11px] bg-slate-200 text-secondary font-medium px-2 py-0.5 rounded-full">
                      All read
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-accent hover:text-blue-700 font-medium flex items-center gap-1 hover:underline px-1.5 py-1 rounded"
                    >
                      <CheckCheck size={14} />
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-secondary hover:text-danger font-medium px-1.5 py-1 rounded"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-secondary text-sm">
                    <Bell size={28} className="mx-auto mb-2 opacity-30" />
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id, n.route)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                        n.unread ? 'bg-slate-50/70 font-medium' : 'bg-surface'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0 mt-0.5">
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className={`text-xs ${n.unread ? 'font-semibold text-primary' : 'text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-secondary whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-secondary truncate">{n.message}</p>
                      </div>
                      {n.unread && (
                        <span className="h-2 w-2 rounded-full bg-accent flex-shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-border text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    if (onNavigate) onNavigate('Settings');
                  }}
                  className="text-xs text-accent hover:text-blue-700 font-medium flex items-center justify-center gap-1 w-full py-1"
                >
                  <Settings size={13} />
                  Configure Notification Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account Button & Dropdown */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false);
            }}
            aria-label="Profile"
            className={`flex items-center gap-2 p-1.5 rounded-full md:rounded-lg transition-all ${
              showAccountMenu
                ? 'bg-slate-100 ring-2 ring-accent/20'
                : 'hover:bg-slate-100 text-primary'
            }`}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-accent text-white font-semibold text-xs flex items-center justify-center shadow-sm">
                AM
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-surface" />
            </div>
            <div className="hidden md:flex flex-col text-left pr-1">
              <span className="text-xs font-semibold text-primary leading-tight">Alex Morgan</span>
              <span className="text-[10px] text-secondary leading-tight">Analytics Lead</span>
            </div>
          </button>

          {/* Account Menu Dropdown */}
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in duration-150">
              {/* Profile Card Header */}
              <div className="p-4 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-white font-bold text-sm flex items-center justify-center ring-2 ring-white/20">
                    AM
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate">Alex Morgan</h4>
                    <p className="text-xs text-slate-300 truncate">alex.morgan@company.com</p>
                    <span className="inline-block text-[10px] bg-accent/30 text-blue-200 px-2 py-0.5 rounded-full mt-1 font-medium">
                      Admin / Operations Lead
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 text-xs text-primary divide-y divide-border/60">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between text-secondary hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-medium">
                      <UserCheck size={16} className="text-accent" />
                      <span>View Profile & Details</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      if (onNavigate) onNavigate('Settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between text-secondary hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-medium">
                      <Settings size={16} className="text-slate-600" />
                      <span>Account Settings</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      showToast(`Audio alerts ${!soundEnabled ? 'enabled' : 'muted'}`);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between text-secondary hover:text-primary transition-colors"
                  >
                    <div className="flex items-center gap-2.5 font-medium">
                      {soundEnabled ? (
                        <Volume2 size={16} className="text-success" />
                      ) : (
                        <VolumeX size={16} className="text-secondary" />
                      )}
                      <span>Notification Sounds</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {soundEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowAccountMenu(false);
                      showToast('Signed out of session (Demo Mode)');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 text-danger flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent text-white font-bold text-2xl flex items-center justify-center ring-4 ring-white/20 shadow-lg">
                  AM
                </div>
                <div>
                  <h3 className="text-lg font-bold">Alex Morgan</h3>
                  <p className="text-xs text-slate-300">alex.morgan@company.com</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                      Active Session
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-sm text-primary">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-1">
                    <Building size={14} className="text-accent" />
                    <span>Department</span>
                  </div>
                  <p className="font-semibold text-xs">E-Commerce Operations</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-1">
                    <MapPin size={14} className="text-accent" />
                    <span>Location</span>
                  </div>
                  <p className="font-semibold text-xs">San Francisco, CA</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-1">
                    <Calendar size={14} className="text-accent" />
                    <span>Member Since</span>
                  </div>
                  <p className="font-semibold text-xs">January 2024</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-border/60">
                  <div className="flex items-center gap-1.5 text-xs text-secondary mb-1">
                    <Shield size={14} className="text-accent" />
                    <span>Access Level</span>
                  </div>
                  <p className="font-semibold text-xs">Super Admin</p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-3">
                <Sparkles size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">System Role & Permissions</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    Full access to order data, inventory management, analytics metrics, and delivery status logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  if (onNavigate) onNavigate('Settings');
                }}
                className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
              >
                <Settings size={14} />
                Edit Profile in Settings
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
