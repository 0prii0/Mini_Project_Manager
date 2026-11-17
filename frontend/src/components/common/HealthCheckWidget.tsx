'use client';

import React from 'react';
import { useGetHealthQuery } from '@/store/api/baseApi';
import { Activity, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const HealthCheckWidget: React.FC = () => {
  const { data, error, isLoading, isFetching, refetch } = useGetHealthQuery(undefined, {
    pollingInterval: 30000,
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">RTK Query & Backend Health Status</h3>
            <p className="text-xs text-slate-500">Live communication test between Next.js & Express API</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refetch
        </button>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Connecting to backend at <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">/api/health</code>...</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">Backend server not reachable on localhost:5000</p>
              <p className="text-amber-700 mt-0.5">
                Start the backend server with <code className="bg-amber-100 px-1 py-0.5 rounded">npm run dev:backend</code> to test live communication.
              </p>
            </div>
          </div>
        ) : data ? (
          <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
            <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold">{data.message}</p>
              <p className="text-emerald-700 mt-0.5 font-mono">
                API Response Time: {data.timestamp}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
