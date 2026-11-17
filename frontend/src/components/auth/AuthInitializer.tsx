'use client';

import React, { useEffect } from 'react';
import { useGetCurrentUserQuery } from '@/features/auth/authApi';
import { useAppDispatch } from '@/hooks/redux';
import { setInitializing } from '@/features/auth/authSlice';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading, isFetching } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!isLoading && !isFetching) {
      dispatch(setInitializing(false));
    }
  }, [isLoading, isFetching, dispatch]);

  return <>{children}</>;
};
