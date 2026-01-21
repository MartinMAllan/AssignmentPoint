'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getWalletBalance } from '@/lib/api/payment.service'

export function WalletWidget() {
  const [balance, setBalance] = useState('0.00')
  const [totalDeposited, setTotalDeposited] = useState('0.00')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await getWalletBalance()
        setBalance(response.data?.balance || '0.00')
        setTotalDeposited(response.data?.totalDeposited || '0.00')
      } catch (error) {
        console.error('Error fetching wallet:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>Funds available for posting orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Balance:</span>
            <span className="text-2xl font-bold text-blue-600">${balance}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Deposited:</span>
            <span className="text-gray-900">${totalDeposited}</span>
          </div>
          <Link href="/customer/deposit">
            <Button className="w-full">Add Funds</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
