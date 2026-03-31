import { useState, useEffect } from 'react';
import { Transaction, Account, JournalEntry, LedgerEntry, AccountType } from './types';

const STORAGE_KEY = 'accounting_data';

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'cash', name: 'Cash', type: 'Asset', balance: 0 },
  { id: 'accounts_receivable', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
  { id: 'inventory', name: 'Inventory', type: 'Asset', balance: 0 },
  { id: 'supplies', name: 'Supplies', type: 'Asset', balance: 0 },
  { id: 'prepaid_insurance', name: 'Prepaid Insurance', type: 'Asset', balance: 0 },
  { id: 'equipment', name: 'Equipment', type: 'Asset', balance: 0 },
  { id: 'accounts_payable', name: 'Accounts Payable', type: 'Liability', balance: 0 },
  { id: 'unearned_revenue', name: 'Unearned Revenue', type: 'Liability', balance: 0 },
  { id: 'notes_payable', name: 'Notes Payable', type: 'Liability', balance: 0 },
  { id: 'capital', name: 'Owner\'s Capital', type: 'Equity', balance: 0 },
  { id: 'drawings', name: 'Owner\'s Drawings', type: 'Equity', balance: 0 },
  { id: 'service_revenue', name: 'Service Revenue', type: 'Revenue', balance: 0 },
  { id: 'rent_expense', name: 'Rent Expense', type: 'Expense', balance: 0 },
  { id: 'salaries_expense', name: 'Salaries Expense', type: 'Expense', balance: 0 },
  { id: 'utilities_expense', name: 'Utilities Expense', type: 'Expense', balance: 0 },
  { id: 'supplies_expense', name: 'Supplies Expense', type: 'Expense', balance: 0 },
  { id: 'insurance_expense', name: 'Insurance Expense', type: 'Expense', balance: 0 },
  { id: 'depreciation_expense', name: 'Depreciation Expense', type: 'Expense', balance: 0 },
];

export function useAccountingStore() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setTransactions(data.transactions || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions }));
    updateAccounts();
  }, [transactions]);

  const updateAccounts = () => {
    const newAccounts = INITIAL_ACCOUNTS.map(acc => ({ ...acc, balance: 0 }));
    
    transactions.forEach(tx => {
      const debitAcc = newAccounts.find(a => a.id === tx.debitAccount);
      const creditAcc = newAccounts.find(a => a.id === tx.creditAccount);

      if (debitAcc) {
        if (['Asset', 'Expense'].includes(debitAcc.type)) {
          debitAcc.balance += tx.amount;
        } else {
          debitAcc.balance -= tx.amount;
        }
      }

      if (creditAcc) {
        if (['Asset', 'Expense'].includes(creditAcc.type)) {
          creditAcc.balance -= tx.amount;
        } else {
          creditAcc.balance += tx.amount;
        }
      }
    });

    setAccounts(newAccounts);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: crypto.randomUUID() };
    setTransactions(prev => [...prev, newTx]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const getJournalEntries = (): JournalEntry[] => {
    const entries: JournalEntry[] = [];
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(tx => {
      entries.push({
        id: tx.id + '-debit',
        date: tx.date,
        description: tx.description,
        debit: tx.amount,
        credit: 0,
        account: tx.debitAccount,
        transactionId: tx.id
      });
      entries.push({
        id: tx.id + '-credit',
        date: tx.date,
        description: '',
        debit: 0,
        credit: tx.amount,
        account: tx.creditAccount,
        transactionId: tx.id
      });
    });
    return entries;
  };

  const getLedger = (accountId: string): LedgerEntry[] => {
    const ledger: LedgerEntry[] = [];
    let balance = 0;
    const account = accounts.find(a => a.id === accountId);
    if (!account) return [];

    transactions
      .filter(tx => tx.debitAccount === accountId || tx.creditAccount === accountId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(tx => {
        const isDebit = tx.debitAccount === accountId;
        const debit = isDebit ? tx.amount : 0;
        const credit = isDebit ? 0 : tx.amount;

        if (['Asset', 'Expense'].includes(account.type)) {
          balance += debit - credit;
        } else {
          balance += credit - debit;
        }

        ledger.push({
          date: tx.date,
          description: tx.description,
          debit,
          credit,
          balance
        });
      });

    return ledger;
  };

  const getTrialBalance = () => {
    const debits = accounts.reduce((sum, acc) => {
      if (['Asset', 'Expense'].includes(acc.type)) {
        return sum + (acc.balance > 0 ? acc.balance : 0);
      } else {
        return sum + (acc.balance < 0 ? Math.abs(acc.balance) : 0);
      }
    }, 0);

    const credits = accounts.reduce((sum, acc) => {
      if (['Liability', 'Equity', 'Revenue'].includes(acc.type)) {
        return sum + (acc.balance > 0 ? acc.balance : 0);
      } else {
        return sum + (acc.balance < 0 ? Math.abs(acc.balance) : 0);
      }
    }, 0);

    return { debits, credits };
  };

  return {
    transactions,
    accounts,
    addTransaction,
    deleteTransaction,
    getJournalEntries,
    getLedger,
    getTrialBalance
  };
}
