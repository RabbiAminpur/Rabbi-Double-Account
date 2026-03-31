import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  BookOpen, 
  Layers, 
  Scale, 
  FileText, 
  Settings, 
  Plus, 
  Menu, 
  X,
  Globe,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './i18n';
import { useAccountingStore } from './store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'dashboard' | 'transactions' | 'journal' | 'ledger' | 'trial-balance' | 'adjusting' | 'statements';

export default function App() {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { transactions, accounts, addTransaction, deleteTransaction, getJournalEntries, getLedger, getTrialBalance } = useAccountingStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('common.dashboard') },
    { id: 'transactions', icon: ArrowLeftRight, label: t('common.transactions') },
    { id: 'journal', icon: BookOpen, label: t('common.journal') },
    { id: 'ledger', icon: Layers, label: t('common.ledger') },
    { id: 'trial-balance', icon: Scale, label: t('common.trialBalance') },
    { id: 'adjusting', icon: Settings, label: t('common.adjustingEntries') },
    { id: 'statements', icon: FileText, label: t('common.financialStatements') },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-indigo-100">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-neutral-200 sticky top-0 z-50">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-indigo-600 font-serif italic">{t('common.appName')}</h1>
        <button onClick={toggleLanguage} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium uppercase">{i18n.language}</span>
        </button>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-neutral-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600 font-serif italic">{t('common.appName')}</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  currentView === item.id 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-indigo-600" : "text-neutral-400")} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-neutral-100">
            <button onClick={toggleLanguage} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-all">
              <Globe className="w-5 h-5 text-neutral-400" />
              {t('common.language')}: <span className="uppercase font-bold text-indigo-600">{i18n.language}</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-1">
              <LogOut className="w-5 h-5" />
              {t('common.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'transactions' && <TransactionsView />}
              {currentView === 'journal' && <JournalView />}
              {currentView === 'ledger' && <LedgerView />}
              {currentView === 'trial-balance' && <TrialBalanceView />}
              {currentView === 'adjusting' && <AdjustingEntriesView />}
              {currentView === 'statements' && <FinancialStatementsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Views ---

function DashboardView() {
  const { t } = useTranslation();
  const { accounts, transactions } = useAccountingStore();

  const totalIncome = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
  const totalExpense = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
  const profit = totalIncome - totalExpense;

  const stats = [
    { label: t('common.income'), value: totalIncome, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('common.expense'), value: totalExpense, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: t('common.profit'), value: profit, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{t('common.dashboard')}</h2>
        <p className="text-neutral-500">{t('common.welcome')}, Mrhrabby24@gmail.com</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </div>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</p>
            <p className={cn("text-3xl font-bold mt-1", stat.color)}>
              ৳ {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 p-8">
        <h3 className="text-xl font-bold mb-6">{t('common.transactions')}</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-400">{t('common.noTransactions')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="pb-4 font-semibold text-neutral-500">{t('common.date')}</th>
                  <th className="pb-4 font-semibold text-neutral-500">{t('common.description')}</th>
                  <th className="pb-4 font-semibold text-neutral-500 text-right">{t('common.amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {transactions.slice(-5).reverse().map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 text-sm text-neutral-600">{tx.date}</td>
                    <td className="py-4 font-medium">{tx.description}</td>
                    <td className="py-4 text-right font-bold">৳ {tx.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionsView() {
  const { t } = useTranslation();
  const { transactions, accounts, addTransaction, deleteTransaction } = useAccountingStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    debitAccount: 'cash',
    creditAccount: 'service_revenue',
    amount: 0,
    category: 'General'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(formData);
    setIsAdding(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      debitAccount: 'cash',
      creditAccount: 'service_revenue',
      amount: 0,
      category: 'General'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('common.transactions')}</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          {t('common.addTransaction')}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.date')}</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.description')}</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sales Revenue"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.debit')}</label>
                  <select 
                    value={formData.debitAccount}
                    onChange={e => setFormData({...formData, debitAccount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.credit')}</label>
                  <select 
                    value={formData.creditAccount}
                    onChange={e => setFormData({...formData, creditAccount: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.amount')}</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{t('common.category')}</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-xl font-semibold text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.date')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.description')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.debit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.credit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.amount')}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-neutral-600 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 font-medium">{tx.description}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{tx.debitAccount}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{tx.creditAccount}</td>
                  <td className="px-6 py-4 text-right font-bold">৳ {tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-2 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JournalView() {
  const { t } = useTranslation();
  const { getJournalEntries, accounts } = useAccountingStore();
  const entries = getJournalEntries();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('common.journal')}</h2>
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.date')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.account')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.debit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.credit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {entries.map((entry, idx) => {
                const accountName = accounts.find(a => a.id === entry.account)?.name || entry.account;
                const isCredit = entry.credit > 0;
                return (
                  <tr key={entry.id} className={cn("hover:bg-neutral-50/50 transition-colors", isCredit ? "bg-neutral-50/20" : "")}>
                    <td className="px-6 py-4 text-sm text-neutral-600">{entry.date}</td>
                    <td className={cn("px-6 py-4 font-medium", isCredit ? "pl-12 text-neutral-500" : "text-neutral-900")}>
                      {accountName}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {entry.debit > 0 ? `৳ ${entry.debit.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {entry.credit > 0 ? `৳ ${entry.credit.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LedgerView() {
  const { t } = useTranslation();
  const { accounts, getLedger } = useAccountingStore();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');

  const ledgerEntries = getLedger(selectedAccount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('common.ledger')}</h2>
        <select 
          value={selectedAccount}
          onChange={e => setSelectedAccount(e.target.value)}
          className="px-6 py-3 rounded-2xl border border-neutral-200 bg-white font-semibold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        >
          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.date')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.description')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.debit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.credit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.balance')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {ledgerEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-neutral-600">{entry.date}</td>
                  <td className="px-6 py-4 font-medium">{entry.description}</td>
                  <td className="px-6 py-4 text-right font-mono">{entry.debit > 0 ? `৳ ${entry.debit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-right font-mono">{entry.credit > 0 ? `৳ ${entry.credit.toLocaleString()}` : '-'}</td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-600 font-mono">৳ {entry.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrialBalanceView() {
  const { t } = useTranslation();
  const { accounts, getTrialBalance } = useAccountingStore();
  const { debits, credits } = getTrialBalance();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('common.trialBalance')}</h2>
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest">{t('common.account')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.debit')}</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 uppercase text-xs tracking-widest text-right">{t('common.credit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {accounts.filter(a => a.balance !== 0).map((acc) => {
                const isDebit = ['Asset', 'Expense'].includes(acc.type);
                const debitVal = isDebit ? (acc.balance > 0 ? acc.balance : 0) : (acc.balance < 0 ? Math.abs(acc.balance) : 0);
                const creditVal = !isDebit ? (acc.balance > 0 ? acc.balance : 0) : (acc.balance < 0 ? Math.abs(acc.balance) : 0);
                
                return (
                  <tr key={acc.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{acc.name}</td>
                    <td className="px-6 py-4 text-right font-mono">{debitVal > 0 ? `৳ ${debitVal.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 text-right font-mono">{creditVal > 0 ? `৳ ${creditVal.toLocaleString()}` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50/50 font-bold">
                <td className="px-6 py-6 uppercase tracking-widest text-sm">{t('common.total')}</td>
                <td className="px-6 py-6 text-right text-indigo-600 text-lg font-mono">৳ {debits.toLocaleString()}</td>
                <td className="px-6 py-6 text-right text-indigo-600 text-lg font-mono">৳ {credits.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {debits !== credits && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">
          ⚠️ Trial Balance is not balanced! Difference: ৳ {Math.abs(debits - credits).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function AdjustingEntriesView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{t('common.adjustingEntries')}</h2>
      <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center">
        <Settings className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
        <p className="text-neutral-400">Adjusting entries feature is coming soon. Use Transactions for now.</p>
      </div>
    </div>
  );
}

function FinancialStatementsView() {
  const { t } = useTranslation();
  const { accounts } = useAccountingStore();

  const revenues = accounts.filter(a => a.type === 'Revenue');
  const expenses = accounts.filter(a => a.type === 'Expense');
  const totalRevenue = revenues.reduce((sum, a) => sum + a.balance, 0);
  const totalExpense = expenses.reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalRevenue - totalExpense;

  const assets = accounts.filter(a => a.type === 'Asset');
  const liabilities = accounts.filter(a => a.type === 'Liability');
  const equity = accounts.filter(a => a.type === 'Equity');
  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0) + netIncome;

  return (
    <div className="space-y-12 pb-20">
      <h2 className="text-3xl font-bold tracking-tight">{t('common.financialStatements')}</h2>

      {/* Income Statement */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-indigo-600 rounded-full" />
          <h3 className="text-2xl font-bold">{t('common.incomeStatement')}</h3>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-xs">{t('common.revenue')}</h4>
            {revenues.map(a => (
              <div key={a.id} className="flex justify-between py-1">
                <span>{a.name}</span>
                <span className="font-mono">৳ {a.balance.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold">
              <span>{t('common.total')} {t('common.revenue')}</span>
              <span className="font-mono">৳ {totalRevenue.toLocaleString()}</span>
            </div>

            <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-xs pt-6">{t('common.expenses')}</h4>
            {expenses.map(a => (
              <div key={a.id} className="flex justify-between py-1">
                <span>{a.name}</span>
                <span className="font-mono">৳ {a.balance.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold">
              <span>{t('common.total')} {t('common.expenses')}</span>
              <span className="font-mono">৳ {totalExpense.toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-8 mt-4 border-t-2 border-indigo-100 font-bold text-xl text-indigo-600">
              <span>Net Income / (Loss)</span>
              <span className="font-mono">৳ {netIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Balance Sheet */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-emerald-600 rounded-full" />
          <h3 className="text-2xl font-bold">{t('common.balanceSheet')}</h3>
        </div>
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-xs">{t('common.assets')}</h4>
              {assets.map(a => (
                <div key={a.id} className="flex justify-between py-1">
                  <span>{a.name}</span>
                  <span className="font-mono">৳ {a.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 border-t border-neutral-100 font-bold text-lg text-emerald-600">
                <span>{t('common.total')} {t('common.assets')}</span>
                <span className="font-mono">৳ {totalAssets.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-xs">{t('common.liabilities')}</h4>
              {liabilities.map(a => (
                <div key={a.id} className="flex justify-between py-1">
                  <span>{a.name}</span>
                  <span className="font-mono">৳ {a.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold">
                <span>{t('common.total')} {t('common.liabilities')}</span>
                <span className="font-mono">৳ {totalLiabilities.toLocaleString()}</span>
              </div>

              <h4 className="font-bold text-neutral-400 uppercase tracking-widest text-xs pt-6">{t('common.equity')}</h4>
              {equity.map(a => (
                <div key={a.id} className="flex justify-between py-1">
                  <span>{a.name}</span>
                  <span className="font-mono">৳ {a.balance.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-1 italic text-neutral-500">
                <span>Retained Earnings (Net Income)</span>
                <span className="font-mono">৳ {netIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold">
                <span>{t('common.total')} {t('common.equity')}</span>
                <span className="font-mono">৳ {totalEquity.toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-neutral-100 font-bold text-lg text-indigo-600">
                <span>Total Liabilities & Equity</span>
                <span className="font-mono">৳ {(totalLiabilities + totalEquity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

