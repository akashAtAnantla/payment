'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Payment Gateway Management System</h1>
        <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}