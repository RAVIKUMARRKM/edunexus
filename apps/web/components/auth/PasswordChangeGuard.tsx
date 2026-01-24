'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function PasswordChangeGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only check when session is loaded and user is authenticated
    if (status === 'authenticated' && session?.user?.forcePasswordChange) {
      // Don't redirect if already on the change password page
      if (pathname !== '/change-password') {
        router.push('/change-password');
      }
    }
  }, [session, status, router, pathname]);

  return <>{children}</>;
}
