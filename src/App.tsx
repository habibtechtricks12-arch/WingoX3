import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/Toast';
import { BottomNavigation } from './components/BottomNavigation';
import { Home } from './pages/Home';
import { Slots } from './pages/Slots';
import { AviatorGame } from './pages/AviatorGame';
import { SuperAceGame } from './pages/SuperAceGame';
import { Lottery } from './pages/Lottery';
import { Invite } from './pages/Invite';
import { RewardCenter } from './pages/RewardCenter';
import { MemberCenter } from './pages/MemberCenter';
import { Deposit } from './pages/Deposit';
import { Withdrawal } from './pages/Withdrawal';
import { BankAccount } from './pages/BankAccount';
import { SecurityCenter } from './pages/SecurityCenter';
import { BettingRecord } from './pages/BettingRecord';
import { ProfitLoss } from './pages/ProfitLoss';
import { TransactionRecords } from './pages/TransactionRecords';
import { MissionCenter } from './pages/MissionCenter';
import { RebateCenter } from './pages/RebateCenter';
import { InternalMessages } from './pages/InternalMessages';
import { Suggestion } from './pages/Suggestion';
import { DownloadApp } from './pages/DownloadApp';
import { CustomerService } from './pages/CustomerService';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { DepositProvider } from './context/DepositContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AviatorControlProvider } from './context/AviatorControlContext';
import { AdminDepositPanel } from './components/deposit/AdminDepositPanel';
import { Smartphone, Monitor } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, isPhoneFrame, togglePhoneFrame, navigate } = useApp();

  const isCasinoGame = currentRoute === 'aviator' || currentRoute === 'super-ace';
  const hideBottomNav =
    isCasinoGame ||
    currentRoute === 'deposit' ||
    currentRoute === 'withdrawal' ||
    currentRoute === 'admin' ||
    currentRoute === 'bank-account' ||
    currentRoute === 'login' ||
    currentRoute === 'register';

  const renderActiveRoute = () => {

    switch (currentRoute) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'home':
        return <Home />;
      case 'slots':
        return <Slots />;
      case 'aviator':
        return <AviatorGame />;
      case 'super-ace':
        return <SuperAceGame />;
      case 'lottery':
        return <Lottery />;
      case 'invite':
      case 'invite/overview':
      case 'invite/rewards':
      case 'invite/earnings':
      case 'invite/records':
      case 'invite/list':
        return <Invite />;
      case 'reward':
        return <RewardCenter />;
      case 'member':
        return <MemberCenter />;
      case 'member/betting-record':
        return <BettingRecord />;
      case 'member/profit-loss':
        return <ProfitLoss />;
      case 'member/deposit-record':
        return <TransactionRecords pageTitle="Deposit Record" initialType="deposit" />;
      case 'member/withdrawal-record':
        return <TransactionRecords pageTitle="Withdrawal Record" initialType="withdrawal" />;
      case 'member/account-record':
        return <TransactionRecords pageTitle="Account Record" initialType="all" />;
      case 'member/security':
        return <SecurityCenter />;
      case 'member/mission':
        return <MissionCenter />;
      case 'member/rebate':
        return <RebateCenter />;
      case 'member/messages':
        return <InternalMessages />;
      case 'member/suggestion':
        return <Suggestion />;
      case 'member/download':
        return <DownloadApp />;
      case 'member/customer-service':
        return <CustomerService />;
      case 'deposit':
        return <Deposit />;
      case 'withdrawal':
        return <Withdrawal />;
      case 'bank-account':
        return <BankAccount />;
      case 'admin':
        return <AdminDepositPanel onBackToApp={() => navigate('home')} />;
      default:
        return <Home />;
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex justify-center items-center">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Main Viewport Container */}
      {isPhoneFrame ? (
        // Desktop Phone Shell Frame
        <div className="py-6 px-2 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-[430px] min-h-[880px] bg-[#061E26] rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-[10px] border-slate-950 overflow-hidden relative flex flex-col">
            {/* Phone speaker notch */}
            <div className="w-32 h-4 bg-slate-950 rounded-b-2xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Scrollable app area */}
            <div className={`flex-1 overflow-y-auto no-scrollbar ${isCasinoGame ? 'p-0' : 'pt-2'}`}>
              {renderActiveRoute()}
            </div>

            {/* Fixed bottom navigation */}
            {!hideBottomNav && <BottomNavigation />}
          </div>
        </div>
      ) : (
        // Standard mobile-first fluid responsive container
        <div className="w-full min-h-screen bg-[#061E26] relative max-w-lg mx-auto shadow-2xl flex flex-col">
          <div className={`flex-1 ${hideBottomNav ? 'pb-0' : 'pb-16'}`}>
            {renderActiveRoute()}
          </div>
          {!hideBottomNav && <BottomNavigation />}
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <SiteSettingsProvider>
        <DepositProvider>
          <AviatorControlProvider>
            <AppContent />
          </AviatorControlProvider>
        </DepositProvider>
      </SiteSettingsProvider>
    </AppProvider>
  );
}

