import React, { useState, useEffect } from 'react';
import { Plus, Minus, History } from 'lucide-react';
import { transactionService, type TransactionHistory } from '../services/transactionService';
import { formatCurrency, formatDate } from '../utils/formatters';
import Alert from '../components/UI/Alert';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../context/auth';

const Dashboard: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    loadTransactionHistory();
  }, []);

  const loadTransactionHistory = async () => {
    try {
      const history = await transactionService.getHistory(1, 5);
      setTransactionHistory(history);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setLoading(false);
      return;
    }

    try {
      let response;
      if (transactionType === 'deposit') {
        response = await transactionService.deposit(transactionAmount, description);
      } else {
        response = await transactionService.withdraw(transactionAmount, description);
      }

      updateBalance(response.transaction.balanceAfter);
      setMessage({ type: 'success', text: response.message });
      setAmount('');
      setDescription('');
      loadTransactionHistory();
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setMessage({ type: 'error', text: err.response?.data?.message || 'Transaction failed' });
      } else {
        setMessage({ type: 'error', text: 'Transaction failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const lowBalance = user && user.balance < 1000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {lowBalance && (
        <div className="mb-6">
          <Alert
            type="warning"
            message="Your balance is low. Please consider making a deposit."
          />
        </div>
      )}

      {message && (
        <div className="mb-6">
          <Alert
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600">Current Balance</h2>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {formatCurrency(user?.balance || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Account Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Make a {transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </h3>
          
          <div className="flex space-x-2 mb-6">
            <button
              type="button"
              onClick={() => setTransactionType('deposit')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                transactionType === 'deposit'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Deposit
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('withdraw')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                transactionType === 'withdraw'
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <Minus className="h-4 w-4 inline mr-1" />
              Withdraw
            </button>
          </div>

          <form onSubmit={handleTransaction}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (RWF)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter description"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  `${transactionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <History className="h-5 w-5 text-gray-400" />
          </div>

          {historyLoading ? (
            <LoadingSpinner />
          ) : transactionHistory?.transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactionHistory?.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'deposit' ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Bal: {formatCurrency(transaction.balanceAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;