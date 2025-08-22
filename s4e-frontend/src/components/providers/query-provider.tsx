'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({

        defaultOptions: {

          queries: {

            staleTime: 60 * 1000, 
            gcTime: 5 * 60 * 1000, 

            retry: (failureCount, error: any) => {
              if (error?.response?.status === 404) return false;
              
              return failureCount < 3;

            },

            refetchOnWindowFocus: false,

          },

          mutations: {

            retry: 1,

          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
