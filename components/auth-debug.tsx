'use client';

import { useAuth } from '@/contexts/auth-context';

export default function AuthDebug() {
  const { user, isAdmin, loading, initialized } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="mb-1">
        <strong>🔍 Auth Debug:</strong>
      </div>
      <div>Initialized: {initialized ? '✅' : '❌'}</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
      <div>User: {user ? `✅ ${user.email}` : '❌ None'}</div>
      <div>Admin: {isAdmin ? '✅ YES' : '❌ NO'}</div>
      <div>ID: {user?.id?.slice(0, 8) || 'None'}</div>
      <div className="mt-1 text-xs opacity-75">
        Page: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}
      </div>
    </div>
  );
}