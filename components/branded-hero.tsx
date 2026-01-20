'use client'

import { BRAND, BRAND_TEXT } from '@/lib/brand'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function BrandedHero() {
  const features = [
    'Post assignments easily',
    'Connect with vetted writers',
    'Manage bids and payments',
    'Track progress in real-time',
  ]

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image
                  src={BRAND.favicon || "/placeholder.svg"}
                  alt={BRAND.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded"
                />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  {BRAND.name}
                </h1>
              </div>
              <h2 className="text-xl sm:text-2xl text-slate-300 font-light">
                {BRAND_TEXT.tagline}
              </h2>
            </div>

            <p className="text-lg text-slate-400 max-w-2xl">
              {BRAND_TEXT.description}
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className={`w-full sm:w-auto bg-gradient-to-r ${BRAND.gradients.primary} hover:shadow-lg hover:shadow-blue-500/50 transition-all`}
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Visual Element */}
          <div className="relative h-96 lg:h-full">
            <Image
              src={BRAND.logo || "/placeholder.svg"}
              alt={BRAND.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
