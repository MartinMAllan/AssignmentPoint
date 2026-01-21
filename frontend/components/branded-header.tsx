'use client'

import { BRAND } from '@/lib/brand'
import { Button } from '@/components/ui/button'
import { LogOut, Settings, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function BrandedHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={BRAND.urls.home} className="flex items-center gap-2">
          <Image
            src={BRAND.favicon || "/placeholder.svg"}
            alt={BRAND.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded"
          />
          <span className="hidden font-bold text-slate-900 dark:text-white sm:inline">
            {BRAND.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Dashboard
            </Button>
          </Link>
          <Link href="/orders" passHref>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Orders
            </Button>
          </Link>
          <Link href="/messages" passHref>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              Messages
            </Button>
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 hover:text-slate-900"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
