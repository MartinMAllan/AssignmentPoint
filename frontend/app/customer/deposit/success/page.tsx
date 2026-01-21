'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react'
import Loading from './loading'

export default function DepositSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState('success')

  useEffect(() => {
    // In production, verify the payment with your backend
    const paymentIntentId = searchParams.get('payment_intent')
    
    if (paymentIntentId) {
      console.log('Payment intent:', paymentIntentId)
      // Call API to confirm payment
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Suspense fallback={<Loading />}>
          <Card>
            <CardHeader>
              <CardTitle>Deposit Successful</CardTitle>
              <CardDescription>Your funds have been added to your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-5xl">✓</div>
                <p className="text-gray-600">Your deposit is being processed. You can now post orders.</p>
                <div className="space-y-2">
                  <Link href="/customer/orders" className="block">
                    <Button className="w-full">View My Orders</Button>
                  </Link>
                  <Link href="/customer/post-order" className="block">
                    <Button variant="outline" className="w-full bg-transparent">Post New Order</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  )
}
