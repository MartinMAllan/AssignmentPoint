'use client'

import React from "react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/dashboard-layout'
import { createStripeDeposit, createPayPalDeposit, getWalletBalance } from '@/lib/api/payment.service'
import { DollarSign, AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState('0.00')
  const router = useRouter()

  const handleFetchBalance = async () => {
    try {
      const response = await getWalletBalance()
      setWalletBalance(response.balance || '0.00')
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Wallet & Deposits</h1>
            <p className="text-slate-400 mt-1">Add funds to your wallet to post orders and make them visible to writers</p>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">Current Wallet Balance</CardTitle>
            <CardDescription className="text-slate-400">Total funds available for orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-blue-400">${walletBalance}</span>
                <p className="text-slate-400 text-sm mt-1">USD Balance</p>
              </div>
              <Button onClick={handleFetchBalance} variant="outline" className="border-slate-600 hover:bg-slate-700 bg-transparent">Refresh Balance</Button>
            </div>
          </CardContent>
        </Card>

        {/* Deposit Forms */}
        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="stripe" className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-700">
              Stripe Card
            </TabsTrigger>
            <TabsTrigger value="paypal" className="text-slate-300 data-[state=active]:text-slate-100 data-[state=active]:bg-slate-700">
              PayPal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe">
            <StripeDepositForm amount={amount} setAmount={setAmount} loading={loading} setLoading={setLoading} />
          </TabsContent>

          <TabsContent value="paypal">
            <PayPalDepositForm amount={amount} setAmount={setAmount} loading={loading} setLoading={setLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function StripeDepositForm({ amount, setAmount, loading, setLoading }: any) {
  const [clientSecret, setClientSecret] = useState('')
  const [step, setStep] = useState('amount') // 'amount' or 'payment'

  const handleInitiatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      console.log("[v0] Initiating Stripe deposit for amount:", amount)
      const response = await createStripeDeposit(parseFloat(amount), 'Customer wallet deposit')
      console.log("[v0] Stripe deposit response:", response)
      setClientSecret(response.clientSecret || response.data?.clientSecret)
      setStep('payment')
    } catch (error) {
      console.error("[v0] Error initiating payment:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment. Please check your backend connection.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Deposit via Stripe</CardTitle>
        <CardDescription className="text-slate-400">Securely add funds using your credit or debit card</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'amount' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                  min="1"
                  step="0.01"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500"
                />
                <Button 
                  onClick={handleInitiatePayment} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Minimum deposit: $1.00</p>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm amount={amount} clientSecret={clientSecret} onSuccess={() => window.location.href = '/dashboard'} />
          </Elements>
        )}
      </CardContent>
    </Card>
  )
}

function StripeCheckoutForm({ amount, clientSecret, onSuccess }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/customer/deposit/success`,
        },
      })

      if (result.error) {
        setError(`Payment failed: ${result.error.message}`)
      }
    } catch (err) {
      console.error('Error processing payment:', err)
      setError('Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      <div className="flex justify-between items-center pt-4 border-t border-slate-700">
        <span className="text-lg font-semibold text-slate-100">Total: <span className="text-blue-400">${amount}</span></span>
        <Button 
          type="submit" 
          disabled={processing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {processing ? 'Processing...' : 'Complete Payment'}
        </Button>
      </div>
    </form>
  )
}

function PayPalDepositForm({ amount, setAmount, loading, setLoading }: any) {
  const router = useRouter()

  const handlePayPalDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      const response = await createPayPalDeposit(
        parseFloat(amount),
        `${window.location.origin}/customer/deposit/success`,
        'Customer wallet deposit'
      )
      // Redirect to PayPal in production
      // window.location.href = response.redirectUrl
      alert('PayPal integration coming soon. Please use Stripe for now.')
    } catch (error) {
      console.error('Error with PayPal:', error)
      alert('Failed to initiate PayPal payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Deposit via PayPal</CardTitle>
        <CardDescription className="text-slate-400">Add funds using your PayPal account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-amber-900/20 border border-amber-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-300">PayPal integration is coming soon. Please use Stripe for now.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={true}
                min="1"
                step="0.01"
                className="bg-slate-700 border-slate-600 text-slate-500 placeholder-slate-600"
              />
              <Button 
                onClick={handlePayPalDeposit} 
                disabled={true}
                className="bg-slate-700 hover:bg-slate-700 text-slate-500 cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
