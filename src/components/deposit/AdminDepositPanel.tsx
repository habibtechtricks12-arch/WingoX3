import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDeposit } from '../../context/DepositContext';
import { GatewayApiConfig, DepositMethodConfig, DepositPromotion } from '../../types/deposit';
import {
  ShieldCheck,
  Server,
  CreditCard,
  Gift,
  ListOrdered,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Key,
  Globe,
  Radio,
  Copy,
  ChevronLeft,
  Smartphone,
  Eye,
  Check,
  Lock,
  Power,
  PowerOff,
  Wifi,
  WifiOff,
  Activity,
  Image,
  Plane,
} from 'lucide-react';
import { AdminBrandingBanners } from '../admin/AdminBrandingBanners';
import { AviatorAdminTab } from '../admin/AviatorAdminTab';


interface Props {
  onBackToApp?: () => void;
}

export const AdminDepositPanel: React.FC<Props> = ({ onBackToApp }) => {
  const { user, showToast, navigate } = useApp();
  const {
    gateways,
    saveGateway,
    toggleGatewayStatus,
    deleteGateway,
    testGatewayConnection,
    methods,
    saveMethod,
    deleteMethod,
    promotions,
    savePromotion,
    deletePromotion,
    orders,
    approveOrder,
    rejectOrder,
    withdrawalRequests,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
    resetToDefaults,
  } = useDeposit();

  const [activeTab, setActiveTab] = useState<'banners' | 'aviator' | 'gateways' | 'methods' | 'promotions' | 'orders' | 'withdrawals'>('aviator');

  // Editing Gateway state
  const [editingGateway, setEditingGateway] = useState<GatewayApiConfig | null>(null);
  const [isNewGateway, setIsNewGateway] = useState(false);

  // Editing Method state
  const [editingMethod, setEditingMethod] = useState<DepositMethodConfig | null>(null);
  const [isNewMethod, setIsNewMethod] = useState(false);

  // Editing Promotion state
  const [editingPromotion, setEditingPromotion] = useState<DepositPromotion | null>(null);
  const [isNewPromotion, setIsNewPromotion] = useState(false);

  // Filter orders
  const [orderFilter, setOrderFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const pendingWithdrawalCount = withdrawalRequests.filter((w) => w.status === 'Pending').length;

  // Selected gateway for inline API Configuration section
  const [selectedApiConfigId, setSelectedApiConfigId] = useState<string>(gateways[0]?.id || '');
  const [showSecretKey, setShowSecretKey] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [webhookCopied, setWebhookCopied] = useState<boolean>(false);

  // Active form state for the API Configuration section
  const [apiForm, setApiForm] = useState<GatewayApiConfig>(() => {
    return gateways[0] || {
      id: 'gw-gbkpay',
      name: 'GBKPAY Automated Gateway',
      provider: 'gbkpay',
      mode: 'automated_api',
      apiUrl: 'https://api.gbkpay.com/api/v1/payment/create',
      apiKey: 'gbk_live_894f71a9c3d2e5b801',
      secretKey: 'sec_live_99a81c7204918eab32',
      merchantId: 'GBK-TCG-9921',
      webhookUrl: `${window.location.origin}/api/deposit/webhook`,
      currency: 'BDT',
      isActive: true,
      autoApprove: true,
      lastPingStatus: 'success',
      lastPingMessage: '200 OK - Gateway Online (38ms)',
    };
  });

  // Keep form in sync when user selects a different gateway in dropdown/tabs
  const handleSelectGatewayToEdit = (gwId: string) => {
    setSelectedApiConfigId(gwId);
    const target = gateways.find((g) => g.id === gwId);
    if (target) {
      setApiForm({ ...target });
    }
  };

  // Save the API configuration directly
  const handleSaveApiConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiForm.apiUrl || !apiForm.apiKey || !apiForm.secretKey || !apiForm.merchantId) {
      showToast('অনুগ্রহ করে সমস্ত প্রয়োজনীয় API ফিল্ড পূরণ করুন', 'error');
      return;
    }
    saveGateway(apiForm);
    showToast(`✅ "${apiForm.name}" এর API কনফিগারেশন সফলভাবে সেভ হয়েছে!`, 'success');
  };

  // Toggle gateway Online/Offline with a single click
  const handleToggleGateway = (gwId: string) => {
    toggleGatewayStatus(gwId);
    if (apiForm.id === gwId) {
      setApiForm((prev) => ({
        ...prev,
        isActive: !prev.isActive,
      }));
    }
  };

  // Toggle active form gateway status
  const handleToggleActiveFormStatus = () => {
    const newStatus = !apiForm.isActive;
    const updated = { ...apiForm, isActive: newStatus };
    setApiForm(updated);
    saveGateway(updated);
  };

  // Test Ping for current API config form

  const handleTestPingApiConfig = async () => {
    setIsPinging(true);
    await testGatewayConnection(apiForm.id);
    setIsPinging(false);
  };

  const copyWebhookUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apiForm.webhookUrl || `${window.location.origin}/api/deposit/webhook`);
      setWebhookCopied(true);
      showToast('Webhook URL কপি হয়েছে!', 'success');
      setTimeout(() => setWebhookCopied(false), 2000);
    }
  };


  const handleStartNewGateway = () => {
    const newGw: GatewayApiConfig = {
      id: `gw-${Date.now()}`,
      name: 'New Custom Auto Gateway',
      provider: 'custom',
      mode: 'automated_api',
      apiUrl: 'https://api.payment-gateway.com/v1/checkout',
      apiKey: 'api_key_' + Math.random().toString(36).substring(2, 10),
      secretKey: 'sec_key_' + Math.random().toString(36).substring(2, 12),
      merchantId: 'MERCHANT-' + Math.floor(1000 + Math.random() * 9000),
      webhookUrl: `${window.location.origin}/api/deposit/webhook`,
      currency: 'BDT',
      isActive: true,
      autoApprove: true,
      lastPingStatus: 'idle',
    };
    setEditingGateway(newGw);
    setIsNewGateway(true);
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGateway) return;
    saveGateway(editingGateway);
    setEditingGateway(null);
    setIsNewGateway(false);
  };

  const handleStartNewMethod = () => {
    const newM: DepositMethodConfig = {
      id: `method-${Date.now()}`,
      name: 'NEW PAYMENT METHOD',
      subtitle: 'CASH OUT',
      channelLabel: 'NEW METHOD | GBKPAY',
      brand: 'other',
      type: 'cash_out',
      mode: 'automated_api',
      gatewayId: gateways[0]?.id || 'gw-gbkpay',
      agentNumber: '01800000000',
      minAmount: 100,
      maxAmount: 50000,
      presets: [100, 300, 500, 1000, 3000, 5000, 10000, 20000, 30000, 50000],
      isActive: true,
      isVip: false,
      order: methods.length + 1,
    };
    setEditingMethod(newM);
    setIsNewMethod(true);
  };

  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;
    saveMethod(editingMethod);
    setEditingMethod(null);
    setIsNewMethod(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#061E26] border-b border-[#0F3644] px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (onBackToApp ? onBackToApp() : navigate('home'))}
              className="p-1.5 rounded-lg bg-[#0A2E3B] hover:bg-[#0F3C4D] text-[#FBBF24] flex items-center gap-1 text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Exit Admin / অ্যাপে ফিরুন</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base font-black text-white">Deposit & Gateway Admin Control</h1>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('সব সেটিংস স্ক্রিনশটের ডিফল্ট অবস্থায় রিসেট করতে চান?')) {
                resetToDefaults();
              }
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
            title="Reset to initial screenshot configuration"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </header>

      {/* Main Tabs */}
      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 bg-[#082833] p-1.5 rounded-2xl border border-[#114555]">
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'banners'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4 shrink-0" />
            <span className="truncate">ব্যানার ও লোগো</span>
          </button>

          <button
            onClick={() => setActiveTab('aviator')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'aviator'
                ? 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4 shrink-0 text-amber-300 transform -rotate-45" />
            <span className="truncate">✈️ Aviator ক্র্যাশ কন্ট্রোল</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'gateways'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 shrink-0" />
            <span className="truncate">API Config</span>
          </button>

          <button
            onClick={() => setActiveTab('methods')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'methods'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">Deposit Methods</span>
          </button>


          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'promotions'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span className="truncate">Promotions</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'orders'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ListOrdered className="w-4 h-4 shrink-0" />
            <span className="truncate">Orders</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-black animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'withdrawals'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="truncate">Withdrawals</span>
            {pendingWithdrawalCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#E11D48] text-white rounded-full text-[9px] font-black animate-bounce">
                {pendingWithdrawalCount}
              </span>
            )}
          </button>
        </div>


        {/* ===================== TAB 0: BANNERS & BRANDING ===================== */}
        {activeTab === 'banners' && <AdminBrandingBanners />}

        {/* ===================== TAB: AVIATOR LIVE CRASH MONITOR & CONTROL ===================== */}
        {activeTab === 'aviator' && <AviatorAdminTab />}

        {/* ===================== TAB 1: API CONFIGURATION ===================== */}
        {activeTab === 'gateways' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Key className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black text-white">
                    API Configuration (গেটওয়ে এপিআই কনফিগারেশন)
                  </h3>
                  {/* Status Count Badges */}
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {gateways.filter((g) => g.isActive).length} Online
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {gateways.filter((g) => !g.isActive).length} Offline
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Input and save gateway API keys (Merchant ID, API Secret, Endpoint URL) for automated deposit processing.
                </p>
              </div>
              <button
                onClick={handleStartNewGateway}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Gateway Profile
              </button>
            </div>

            {/* Main Interactive API Configuration Form Card */}
            <div className="rounded-3xl bg-[#082833] border-2 border-[#155366] p-5 shadow-xl space-y-4">
              {/* Gateway Profile Switcher Tabs */}
              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  Select Gateway to Configure:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {gateways.map((gw) => {
                    const isSelected = apiForm.id === gw.id;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => handleSelectGatewayToEdit(gw.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                            : 'bg-[#051C23] text-slate-300 border-[#0F3E4E] hover:border-slate-500'
                        }`}
                      >
                        <Server className="w-3.5 h-3.5" />
                        <span>{gw.name}</span>
                        {/* Live Online / Offline Indicator Pill */}
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            gw.isActive
                              ? isSelected
                                ? 'bg-slate-950/20 text-slate-950 font-black'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isSelected
                              ? 'bg-rose-950/40 text-rose-950'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              gw.isActive
                                ? isSelected ? 'bg-emerald-950 animate-pulse' : 'bg-emerald-400 animate-pulse'
                                : isSelected ? 'bg-rose-950' : 'bg-rose-500'
                            }`}
                          />
                          {gw.isActive ? 'Online' : 'Offline'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* The API Configuration Form */}
              <form onSubmit={handleSaveApiConfiguration} className="space-y-4 pt-1 border-t border-[#0F3E4E]">
                {/* Row 1: Gateway Name, Provider & 1-Click Status Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Gateway Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={apiForm.name}
                      onChange={(e) => setApiForm({ ...apiForm, name: e.target.value })}
                      placeholder="e.g. GBKPAY Automated Gateway"
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Gateway Provider
                    </label>
                    <select
                      value={apiForm.provider}
                      onChange={(e) => setApiForm({ ...apiForm, provider: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="gbkpay">GBKPAY</option>
                      <option value="rupalipay">RupaliPay</option>
                      <option value="uddoktapay">UddoktaPay</option>
                      <option value="surepay">SurePay</option>
                      <option value="bkash_direct">bKash Direct API</option>
                      <option value="nagad_direct">Nagad Direct API</option>
                      <option value="custom">Custom REST API</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-200">
                        Gateway Status
                      </label>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          apiForm.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${apiForm.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {apiForm.isActive ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    {/* One-click Toggle Switch Button */}
                    <button
                      type="button"
                      onClick={handleToggleActiveFormStatus}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between px-3 transition-all cursor-pointer ${
                        apiForm.isActive
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/50'
                      }`}
                      title={apiForm.isActive ? 'Click to toggle Offline' : 'Click to toggle Online'}
                    >
                      <span className="flex items-center gap-1.5 font-bold">
                        <Power className={`w-4 h-4 ${apiForm.isActive ? 'text-emerald-400' : 'text-rose-400'}`} />
                        <span>{apiForm.isActive ? 'ONLINE (সক্রিয়)' : 'OFFLINE (নিষ্ক্রিয়)'}</span>
                      </span>
                      {/* Animated Switch Pill */}
                      <span
                        className={`inline-flex h-5 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          apiForm.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            apiForm.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  </div>
                </div>


                {/* Row 2: Endpoint URL / API Base URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Endpoint URL / API Base URL (এপিআই রিকোয়েস্ট এন্ডপয়েন্ট)</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">POST /payment/create</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={apiForm.apiUrl}
                    onChange={(e) => setApiForm({ ...apiForm, apiUrl: e.target.value })}
                    placeholder="https://api.payment-gateway.com/v1/checkout/create"
                    className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Row 3: Merchant ID & API Secret */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Merchant ID */}
                  <div>
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Merchant ID / Store ID (মার্চেন্ট আইডি)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={apiForm.merchantId}
                      onChange={(e) => setApiForm({ ...apiForm, merchantId: e.target.value })}
                      placeholder="e.g. GBK-TCG-9921"
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* API Secret */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>API Secret / Secret Key (মার্চেন্ট সিক্রেট কী)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                        className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        {showSecretKey ? <Eye className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecretKey ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showSecretKey ? 'text' : 'password'}
                      required
                      value={apiForm.secretKey}
                      onChange={(e) => setApiForm({ ...apiForm, secretKey: e.target.value })}
                      placeholder="sec_live_xxxxxxxxxxxxxxxx"
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Row 4: API Key / Client ID & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" />
                        <span>API Key / Client ID (পাবলিক/অ্যাপ এপিআই কী)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        {showApiKey ? <Eye className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showApiKey ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      required
                      value={apiForm.apiKey}
                      onChange={(e) => setApiForm({ ...apiForm, apiKey: e.target.value })}
                      placeholder="gbk_live_xxxxxxxxxxxxxxxx"
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Currency (মুদ্রা)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={apiForm.currency || 'BDT (৳)'}
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-slate-400 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Row 5: Webhook URL & Auto-Approve Switch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-200 block">
                        Webhook / Callback URL
                      </label>
                      <button
                        type="button"
                        onClick={copyWebhookUrl}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                      >
                        {webhookCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{webhookCopied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                      </button>
                    </div>
                    <input
                      type="url"
                      value={apiForm.webhookUrl || `${window.location.origin}/api/deposit/webhook`}
                      onChange={(e) => setApiForm({ ...apiForm, webhookUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">
                      Automated Processing & Credit
                    </label>
                    <div className="p-2.5 bg-[#051C23] rounded-xl border border-[#114555] flex items-center justify-between h-[38px]">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={apiForm.autoApprove}
                          onChange={(e) => setApiForm({ ...apiForm, autoApprove: e.target.checked })}
                          className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-emerald-400">
                          Instant Auto-Credit to User Balance
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Test Ping & Save API Keys */}
                <div className="pt-3 border-t border-[#0F3E4E] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestPingApiConfig}
                      disabled={isPinging}
                      className="px-4 py-2.5 rounded-xl bg-[#0E3A48] hover:bg-[#144758] border border-[#164D60] text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Radio className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                      <span>{isPinging ? 'Pinging Endpoint...' : 'Test Connection Ping'}</span>
                    </button>

                    {apiForm.lastPingMessage && (
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {apiForm.lastPingMessage}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save API Configuration</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of Configured Gateways Overview */}
            <div className="pt-2 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Configured Gateway Profiles ({gateways.length})</span>
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {gateways.filter((g) => g.isActive).length} Online
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {gateways.filter((g) => !g.isActive).length} Offline
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {gateways.map((gw) => (
                  <div
                    key={gw.id}
                    className={`rounded-2xl bg-[#082833] border p-4 shadow-md space-y-3 relative overflow-hidden transition-all ${
                      gw.isActive
                        ? 'border-[#155366] shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
                        : 'border-rose-950/60 bg-[#071F27]/85 opacity-90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white truncate">{gw.name}</h4>
                          {/* Live Online / Offline Status Indicator Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase transition-all ${
                              gw.isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                gw.isActive
                                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                                  : 'bg-rose-500'
                              }`}
                            />
                            {gw.isActive ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-300 font-mono block mt-0.5">
                          Provider: {gw.provider.toUpperCase()} · Mode: {gw.mode}
                        </span>
                      </div>

                      {/* Right Action Group: One-Click Toggle + Configure + Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* 1-Click Online/Offline Toggle Switch Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleGateway(gw.id)}
                          className={`group px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm ${
                            gw.isActive
                              ? 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/40 text-emerald-300'
                              : 'bg-rose-950/60 hover:bg-rose-900/80 border-rose-500/40 text-rose-300'
                          }`}
                          title={gw.isActive ? 'Click to toggle Offline' : 'Click to toggle Online'}
                          aria-label={`Toggle ${gw.name} ${gw.isActive ? 'Offline' : 'Online'}`}
                        >
                          <Power className={`w-3.5 h-3.5 ${gw.isActive ? 'text-emerald-400' : 'text-rose-400'}`} />
                          <span className="hidden sm:inline font-mono text-[11px]">
                            {gw.isActive ? 'Online' : 'Offline'}
                          </span>
                          {/* Animated Toggle Slider Pill */}
                          <span
                            className={`inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                              gw.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                gw.isActive ? 'translate-x-3' : 'translate-x-0'
                              }`}
                            />
                          </span>
                        </button>

                        <button
                          onClick={() => handleSelectGatewayToEdit(gw.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Load & Configure in form"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteGateway(gw.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition-colors cursor-pointer"
                          title="Delete Gateway"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* API Parameters View */}
                    <div className="bg-[#051C23] p-2.5 rounded-xl border border-[#0F3E4E] space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Gateway Status:</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            gw.isActive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${gw.isActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {gw.isActive ? 'ONLINE (Ready to accept payments)' : 'OFFLINE (Deposits blocked)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Endpoint URL:</span>
                        <span className="text-slate-200 truncate max-w-[200px]" title={gw.apiUrl}>
                          {gw.apiUrl}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Merchant ID:</span>
                        <span className="text-amber-300 font-bold">{gw.merchantId}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>API Secret:</span>
                        <span className="text-slate-400 font-mono truncate max-w-[180px]">
                          {gw.secretKey ? `${gw.secretKey.slice(0, 6)}••••••••` : '••••••••'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Instant Auto-Credit:</span>
                        <span className={gw.autoApprove ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                          {gw.autoApprove ? 'YES (Instant)' : 'NO (Manual Review)'}
                        </span>
                      </div>
                    </div>


                    {/* Ping Status & Action */}
                    <div className="pt-1 border-t border-[#0F3E4E] flex items-center justify-between">
                      <div className="text-[10px] text-slate-400">
                        {gw.lastPingMessage ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {gw.lastPingMessage}
                          </span>
                        ) : (
                          <span>Ready for testing</span>
                        )}
                      </div>

                      <button
                        onClick={() => testGatewayConnection(gw.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#0E3A48] hover:bg-[#144758] border border-[#164D60] text-amber-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Radio className="w-3 h-3" /> Test Ping API
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal to Add New Gateway */}
            {editingGateway && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
                <div className="w-full max-w-lg bg-[#082833] rounded-3xl p-5 border border-[#144758] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-[#114555]">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-amber-400" />
                      Add New Gateway Profile
                    </h3>
                    <button
                      onClick={() => setEditingGateway(null)}
                      className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveGateway} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Gateway Name / Brand
                      </label>
                      <input
                        type="text"
                        required
                        value={editingGateway.name}
                        onChange={(e) => setEditingGateway({ ...editingGateway, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Custom Automated Gateway"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Provider Type</label>
                        <select
                          value={editingGateway.provider}
                          onChange={(e) =>
                            setEditingGateway({
                              ...editingGateway,
                              provider: e.target.value as any,
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="gbkpay">GBKPAY</option>
                          <option value="rupalipay">RupaliPay</option>
                          <option value="uddoktapay">UddoktaPay</option>
                          <option value="surepay">SurePay</option>
                          <option value="bkash_direct">bKash Direct API</option>
                          <option value="nagad_direct">Nagad Direct API</option>
                          <option value="custom">Custom REST API</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-semibold">Status</label>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                              editingGateway.isActive
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${editingGateway.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                            {editingGateway.isActive ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingGateway({
                              ...editingGateway,
                              isActive: !editingGateway.isActive,
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between px-3 cursor-pointer transition-all ${
                            editingGateway.isActive
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                              : 'bg-rose-950/40 border-rose-500/50 text-rose-300 hover:bg-rose-900/50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 font-bold">
                            <Power className={`w-3.5 h-3.5 ${editingGateway.isActive ? 'text-emerald-400' : 'text-rose-400'}`} />
                            <span>{editingGateway.isActive ? 'ONLINE (সক্রিয়)' : 'OFFLINE (নিষ্ক্রিয়)'}</span>
                          </span>
                          <span
                            className={`inline-flex h-4 w-7 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                              editingGateway.isActive ? 'bg-emerald-500' : 'bg-slate-700'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                editingGateway.isActive ? 'translate-x-3' : 'translate-x-0'
                              }`}
                            />
                          </span>
                        </button>
                      </div>
                    </div>


                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Endpoint URL / API Base URL
                      </label>
                      <input
                        type="url"
                        required
                        value={editingGateway.apiUrl}
                        onChange={(e) => setEditingGateway({ ...editingGateway, apiUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        placeholder="https://api.gateway.com/v1/payment/create"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Merchant ID</label>
                        <input
                          type="text"
                          required
                          value={editingGateway.merchantId}
                          onChange={(e) =>
                            setEditingGateway({ ...editingGateway, merchantId: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                          placeholder="MERCHANT-1092"
                        />
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          API Secret / Secret Key
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGateway.secretKey}
                          onChange={(e) =>
                            setEditingGateway({ ...editingGateway, secretKey: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                          placeholder="sec_live_xxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">API Key / Client ID</label>
                      <input
                        type="text"
                        required
                        value={editingGateway.apiKey}
                        onChange={(e) => setEditingGateway({ ...editingGateway, apiKey: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        placeholder="api_live_xxxxxxxx"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Webhook / Callback URL
                      </label>
                      <input
                        type="url"
                        value={editingGateway.webhookUrl}
                        onChange={(e) =>
                          setEditingGateway({ ...editingGateway, webhookUrl: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                        placeholder="https://mysite.com/api/deposit/callback"
                      />
                    </div>

                    <div className="pt-3 border-t border-[#114555] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingGateway(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-md cursor-pointer"
                      >
                        Create Gateway Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}


        {/* ===================== TAB 2: METHODS & CHANNELS ===================== */}
        {activeTab === 'methods' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Deposit Methods & Channel Manager</h3>
                <p className="text-xs text-slate-400">
                  Control the cards displayed to users (Nagad VIP, bKash Send Money, Nagad Fast, etc.).
                </p>
              </div>
              <button
                onClick={handleStartNewMethod}
                className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Payment Method
              </button>
            </div>

            <div className="space-y-2.5">
              {methods.map((method) => {
                const linkedGw = gateways.find((g) => g.id === method.gatewayId);
                return (
                  <div
                    key={method.id}
                    className="rounded-2xl bg-[#082833] border border-[#114555] p-3.5 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0E3A48] flex items-center justify-center font-bold text-amber-400 border border-[#144758]">
                        {method.brand === 'nagad' ? 'NG' : method.brand === 'bkash' ? 'BK' : 'PAY'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white">
                            {method.name} <span className="text-amber-400">{method.subtitle}</span>
                          </h4>
                          {method.isVip && (
                            <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded text-[9px] font-black">
                              VIP
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              method.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {method.isActive ? 'Active' : 'Disabled'}
                          </span>
                          {/* Linked Gateway Online/Offline Indicator */}
                          {linkedGw && (
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                linkedGw.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              }`}
                              title={`Gateway: ${linkedGw.name} is ${linkedGw.isActive ? 'Online' : 'Offline'}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  linkedGw.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                                }`}
                              />
                              <span>GW: {linkedGw.isActive ? 'Online' : 'Offline'}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Channel: <strong className="text-slate-200">{method.channelLabel}</strong> · Agent:{' '}
                          <strong className="text-amber-300 font-mono">{method.agentNumber}</strong>
                        </span>
                      </div>
                    </div>


                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingMethod(method);
                        setIsNewMethod(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0C3848] hover:bg-[#11485C] text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteMethod(method.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition-colors"
                      title="Delete Method"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Method Modal */}

            {editingMethod && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
                <div className="w-full max-w-lg bg-[#082833] rounded-3xl p-5 border border-[#144758] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-[#114555]">
                    <h3 className="text-base font-black text-white">
                      {isNewMethod ? 'Add Deposit Method' : 'Edit Deposit Method'}
                    </h3>
                    <button
                      onClick={() => setEditingMethod(null)}
                      className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveMethod} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Method Name</label>
                        <input
                          type="text"
                          required
                          value={editingMethod.name}
                          onChange={(e) => setEditingMethod({ ...editingMethod, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-bold"
                          placeholder="e.g. NAGAD VIP"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Subtitle / Badge</label>
                        <input
                          type="text"
                          required
                          value={editingMethod.subtitle}
                          onChange={(e) => setEditingMethod({ ...editingMethod, subtitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-bold"
                          placeholder="e.g. CASH OUT"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">Channel Label</label>
                      <input
                        type="text"
                        required
                        value={editingMethod.channelLabel}
                        onChange={(e) => setEditingMethod({ ...editingMethod, channelLabel: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono"
                        placeholder="NAGAD VIP | GBKPAY"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Brand</label>
                        <select
                          value={editingMethod.brand}
                          onChange={(e) => setEditingMethod({ ...editingMethod, brand: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white"
                        >
                          <option value="nagad">Nagad (নগদ)</option>
                          <option value="bkash">bKash (বিকাশ)</option>
                          <option value="rocket">Rocket</option>
                          <option value="upay">Upay</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Type</label>
                        <select
                          value={editingMethod.type}
                          onChange={(e) => setEditingMethod({ ...editingMethod, type: e.target.value as any })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white"
                        >
                          <option value="cash_out">Cash Out</option>
                          <option value="send_money">Send Money</option>
                          <option value="fast_payment">Fast Payment</option>
                          <option value="auto_api">Direct Auto API</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Active</label>
                        <select
                          value={editingMethod.isActive ? 'yes' : 'no'}
                          onChange={(e) => setEditingMethod({ ...editingMethod, isActive: e.target.value === 'yes' })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white"
                        >
                          <option value="yes">Active (সক্রিয়)</option>
                          <option value="no">Disabled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Linked Automated Gateway
                        </label>
                        <select
                          value={editingMethod.gatewayId}
                          onChange={(e) => setEditingMethod({ ...editingMethod, gatewayId: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white"
                        >
                          {gateways.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Agent / Merchant Number
                        </label>
                        <input
                          type="text"
                          required
                          value={editingMethod.agentNumber}
                          onChange={(e) => setEditingMethod({ ...editingMethod, agentNumber: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono font-bold"
                          placeholder="018XXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Min Deposit (৳)</label>
                        <input
                          type="number"
                          value={editingMethod.minAmount}
                          onChange={(e) => setEditingMethod({ ...editingMethod, minAmount: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Max Deposit (৳)</label>
                        <input
                          type="number"
                          value={editingMethod.maxAmount}
                          onChange={(e) => setEditingMethod({ ...editingMethod, maxAmount: Number(e.target.value) })}
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#114555] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMethod(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-md"
                      >
                        Save Method
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: PROMOTIONS ===================== */}
        {activeTab === 'promotions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Deposit Promotions & Bonus Offers</h3>
                <p className="text-xs text-slate-400">
                  Manage the radio offers shown under "• Promotions" in the deposit page.
                </p>
              </div>
              <button
                onClick={() => {
                  const newP: DepositPromotion = {
                    id: `promo-${Date.now()}`,
                    title: 'নতুন ডিপোজিট বোনাস অফার !',
                    bonusPercent: 15,
                    minAmount: 100,
                    isActive: true,
                  };
                  setEditingPromotion(newP);
                  setIsNewPromotion(true);
                }}
                className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Promotion
              </button>
            </div>

            <div className="space-y-2.5">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-2xl bg-[#082833] border border-[#114555] p-4 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{promo.title}</h4>
                    <span className="text-xs text-amber-300 block mt-0.5 font-mono">
                      Bonus: +{promo.bonusPercent}% · Min Deposit: ৳ {promo.minAmount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPromotion(promo);
                        setIsNewPromotion(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0C3848] text-slate-200 text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Promotion Modal */}
            {editingPromotion && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-xs">
                <div className="w-full max-w-md bg-[#082833] rounded-3xl p-5 border border-[#144758] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#114555]">
                    <h3 className="text-base font-black text-white">
                      {isNewPromotion ? 'Add Promotion Offer' : 'Edit Promotion Offer'}
                    </h3>
                    <button
                      onClick={() => setEditingPromotion(null)}
                      className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      savePromotion(editingPromotion);
                      setEditingPromotion(null);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="text-slate-300 font-semibold block mb-1">
                        Promotion Title (বাংলা বা ইংরেজি)
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPromotion.title}
                        onChange={(e) =>
                          setEditingPromotion({ ...editingPromotion, title: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Bonus Percent (%)</label>
                        <input
                          type="number"
                          required
                          value={editingPromotion.bonusPercent}
                          onChange={(e) =>
                            setEditingPromotion({
                              ...editingPromotion,
                              bonusPercent: Number(e.target.value),
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">Min Deposit (৳)</label>
                        <input
                          type="number"
                          required
                          value={editingPromotion.minAmount}
                          onChange={(e) =>
                            setEditingPromotion({
                              ...editingPromotion,
                              minAmount: Number(e.target.value),
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#051C23] border border-[#114555] text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#114555] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingPromotion(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md"
                      >
                        Save Promotion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: LIVE DEPOSIT REQUESTS ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">Live Deposit Transactions & Orders</h3>
                <p className="text-xs text-slate-400">
                  Review submitted deposits, verify TrxID, and click Approve to credit user balance instantly.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-[#051C23] p-1 rounded-xl border border-[#0F3E4E]">
                {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      orderFilter === filter
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-2.5">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-[#082833] rounded-2xl border border-[#114555]">
                  <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No deposit orders found for "{orderFilter}" filter.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3.5 rounded-2xl bg-[#082833] border border-[#114555] shadow-sm space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{order.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              order.status === 'Approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : order.status === 'Pending'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">{order.methodName}</h4>
                        <span className="text-[11px] text-slate-400 block font-mono">
                          User: <strong className="text-slate-200">{order.userNickname}</strong> ({order.userId}) · {order.timestamp}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black font-mono text-white block">
                          ৳ {order.amount.toFixed(2)}
                        </span>
                        {order.bonusAmount > 0 && (
                          <span className="text-[11px] text-emerald-400 font-mono font-bold block">
                            +Bonus ৳ {order.bonusAmount.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          Credit: ৳ {order.totalCredit.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Transaction Details Line */}
                    <div className="p-2 bg-[#051C23] rounded-xl border border-[#0F3E4E] flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-400">Sender: </span>
                        <strong className="text-slate-200">{order.senderNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">TrxID: </span>
                        <strong className="text-amber-400 font-black">{order.trxId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Channel: </span>
                        <strong className="text-slate-300">{order.channelLabel}</strong>
                      </div>
                    </div>

                    {/* Action buttons if Pending */}
                    {order.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#0F3E4E]">
                        <button
                          onClick={() => rejectOrder(order.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-xs font-bold transition-all"
                        >
                          Reject (বাতিল)
                        </button>
                        <button
                          onClick={() => approveOrder(order.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve & Add Balance (+৳ {order.totalCredit.toFixed(2)})
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: WITHDRAWAL REQUESTS ===================== */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white">User Withdrawal Requests (উত্তোলন রিকোয়েস্ট)</h3>
                <p className="text-xs text-slate-400">
                  Manage user withdrawal requests, send funds to bKash/Nagad/Rocket, and approve or reject.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-[#051C23] p-1 rounded-xl border border-[#0F3E4E]">
                {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setWithdrawalFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      withdrawalFilter === filter
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawals List */}
            <div className="space-y-2.5">
              {withdrawalRequests
                .filter((w) => withdrawalFilter === 'all' || w.status === withdrawalFilter)
                .length === 0 ? (
                <div className="p-8 text-center bg-[#082833] rounded-2xl border border-[#114555]">
                  <CheckCircle2 className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    No withdrawal requests found for "{withdrawalFilter}" filter.
                  </p>
                </div>
              ) : (
                withdrawalRequests
                  .filter((w) => withdrawalFilter === 'all' || w.status === withdrawalFilter)
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-2xl bg-[#082833] border border-[#114555] shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400">{req.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                req.status === 'Approved'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : req.status === 'Pending'
                                  ? 'bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/40 animate-pulse'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white mt-0.5 uppercase">
                            Withdraw to {req.walletType} ({req.accountName})
                          </h4>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            User: <strong className="text-slate-200">{req.userNickname}</strong> ({req.userId}) · {req.timestamp}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black font-mono text-amber-400 block">
                            ৳ {req.amount.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block uppercase">
                            {req.walletType} E-Wallet
                          </span>
                        </div>
                      </div>

                      {/* Payment Destination Box */}
                      <div className="p-2.5 bg-[#051C23] rounded-xl border border-[#0F3E4E] flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-slate-400">Account Number: </span>
                          <strong className="text-amber-300 font-bold text-sm tracking-wide">
                            {req.accountNumber}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Account Name: </span>
                          <strong className="text-slate-200">{req.accountName}</strong>
                        </div>
                      </div>

                      {/* Action buttons if Pending */}
                      {req.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#0F3E4E]">
                          <button
                            onClick={() => rejectWithdrawalRequest(req.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-xs font-bold transition-all"
                            title="Reject request and refund amount to user balance"
                          >
                            Reject & Refund (বাতিল ও ফেরত)
                          </button>
                          <button
                            onClick={() => approveWithdrawalRequest(req.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve & Mark Paid (অনুমোদন)
                          </button>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </main>

    </div>
  );
};
