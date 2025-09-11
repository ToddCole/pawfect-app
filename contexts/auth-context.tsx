'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/lib/supabase-client';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  initialized: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const checkAdminStatus = useCallback(async (currentUser: User | null): Promise<boolean> => {
    if (!currentUser) return false;

    console.log('🔍 Checking admin status for:', currentUser.email);

    // Hardcode Todd as admin as primary method
    if (currentUser.email === 'todd@mensfitnessonline.com.au') {
      console.log('✅ Todd detected - granting admin access (hardcoded)');
      return true;
    }

    // Try database lookups but don't block on them
    try {
      // Try new table structure (id, role)
      const { data: profile1 } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (profile1?.role === 'admin') {
        console.log('✅ Admin role found in new table structure');
        return true;
      }

      // Try old table structure (user_id, is_admin)
      const { data: profile2 } = await supabaseClient
        .from('profiles')
        .select('is_admin')
        .eq('user_id', currentUser.id)
        .single();

      if (profile2?.is_admin === true) {
        console.log('✅ Admin role found in old table structure');
        return true;
      }
    } catch (error) {
      console.log('📊 Database admin check failed (using hardcoded rules):', (error as Error).message);
    }

    console.log('❌ No admin role found');
    return false;
  }, []);

  const handleAuthChange = useCallback(async (session: Session | null) => {
    console.log('🎯 Auth state changed:', session?.user?.email || 'None');
    
    setUser(session?.user ?? null);
    
    if (!session?.user) {
      setIsAdmin(false);
    } else {
      // TEMPORARILY DISABLED: Profile creation to isolate auth issue
      // TODO: Re-enable after fixing Supabase auth configuration
      console.log('⚠️ Profile creation temporarily disabled to debug auth issue');

      const adminStatus = await checkAdminStatus(session.user);
      setIsAdmin(adminStatus);
    }
    
    setLoading(false);
    setInitialized(true);
  }, [checkAdminStatus]);

  const refreshAuth = useCallback(async () => {
    console.log('🔄 Refreshing auth state...');
    setLoading(true);
    
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      await handleAuthChange(session);
    } catch (error) {
      console.error('💥 Auth refresh failed:', error);
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      setInitialized(true);
    }
  }, [handleAuthChange]);

  const signOut = useCallback(async () => {
    console.log('👋 Signing out...');
    setLoading(true);
    await supabaseClient.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial auth check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (mounted) {
          await handleAuthChange(session);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event);
        if (mounted) {
          await handleAuthChange(session);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, initialized, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}