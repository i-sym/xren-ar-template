'use client'

import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { metadata } from './layout'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <div className='flex h-screen w-full flex-col items-center justify-center'>
        <h1 className='text-4xl font-bold'>XREN</h1>
        <Button asChild>
          <Link href='/ar'>AR</Link>
        </Button>
      </div>
    </>
  )
}
