'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../react-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

export const ReactQueryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
