'use client';
import { useEffect, useState } from 'react';
import type { UserPayload } from '@/lib/auth-server';
import { getClientUser } from '../actions/users.actions';

export function useUser() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientUser().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  const isAuthenticated = !!user;
  return { user, loading, isAuthenticated };
}
