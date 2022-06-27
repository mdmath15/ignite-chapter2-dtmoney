import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

interface Transaction {
  id: number
  title: string
  value: number
  type: string
  category: string
  date: string
}

interface TransactionsProviderProps {
  children: React.ReactNode
}

interface TransactionsContextProps {
  transactions: Transaction[]
  addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Promise<void>
}

export const TransactionsContext = createContext<TransactionsContextProps>(
  {} as TransactionsContextProps
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions').then(({ data }) => setTransactions(data.transactions))
  }, [])

  async function addTransaction(transactionInput: Omit<Transaction, 'id' | 'date'>) {
    const newTransaction = {
      ...transactionInput,
      date: new Date()
    }

    const response = await api.post('transactions', newTransaction)
    const { transaction } = response.data

    setTransactions([...transactions, transaction])
  }

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider')
  }
  return context
}
