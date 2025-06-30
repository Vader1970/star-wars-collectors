"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center'>
      <div className='text-center text-white'>
        <h1 className='text-6xl font-bold mb-4'>404</h1>
        <h2 className='text-2xl font-semibold mb-4'>Page Not Found</h2>
        <p className='text-slate-300 mb-8'>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/")} className='bg-blue-600 hover:bg-blue-700'>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
