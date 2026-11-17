import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include', // Sends HttpOnly auth cookie automatically
  }),
  tagTypes: ['User', 'Project', 'Task', 'Dashboard'],
  endpoints: (builder) => ({
    getHealth: builder.query<{ success: boolean; message: string; timestamp: string }, void>({
      query: () => '/health',
    }),
  }),
});

export const { useGetHealthQuery } = baseApi;
