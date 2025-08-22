'use client';

import { useJobResults } from '@/lib/api/hooks';
import JobList from '@/components/JobList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, History, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {

  const { data: jobs, isLoading, error, refetch } = useJobResults();

  const handleRefresh = () => {
    refetch();

  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Job History</h1>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-gray-600 mt-2">View all executed jobs and their results</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-red-800">
                <p className="font-semibold">Error loading job history</p>
                <p className="text-sm mt-1">Please try refreshing the page.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {jobs && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {jobs.filter(job => job.status === 'success').length}
                  </p>
                  <p className="text-sm text-gray-600">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {jobs.filter(job => job.status === 'error').length}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {jobs.filter(job => job.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <JobList jobs={jobs || []} isLoading={isLoading} />
      </div>
    </div>
  );
}
