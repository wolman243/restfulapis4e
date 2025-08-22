'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 

  Terminal, 
  Globe, 
  History, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle

} from 'lucide-react';

import Link from 'next/link';
import { useJobResults } from '@/lib/hooks/useJobs';
import { systemApi } from '@/lib/api/services';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {

  const { data: jobResults, isLoading: isLoadingJobs } = useJobResults();
  
  const { data: systemHealth, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.healthCheck,

    refetchInterval: 30000, // Check every 30 seconds

    retry: 3

  });

  const stats = {

    total: jobResults?.length || 0,
    pending: jobResults?.filter(job => job.status === 'pending').length || 0,
    success: jobResults?.filter(job => job.status === 'success').length || 0,
    error: jobResults?.filter(job => job.status === 'error').length || 0,
    osCommands: jobResults?.filter(job => job.job_name === 'os_command').length || 0,
    crawls: jobResults?.filter(job => job.job_name === 'katana_crawl').length || 0

  };

  const recentJobs = jobResults?.slice(0, 5) || [];

  const getStatusIcon = (status: string) => {

    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Loader2 className="h-4 w-4 text-gray-600" />;

    }
  };

  const getJobIcon = (jobName: string) => {

    switch (jobName) {

      case 'os_command': return <Terminal className="h-4 w-4 text-blue-600" />;
      case 'katana_crawl': return <Globe className="h-4 w-4 text-green-600" />;

      default: return <Activity className="h-4 w-4 text-gray-600" />;

    }
  };

  const formatJobName = (jobName: string) => {

    switch (jobName) {

      case 'os_command': return 'OS Command';
      case 'katana_crawl': return 'Web Crawl';

      default: return jobName;

    }
  };

  const isSystemOnline = !isLoadingHealth && systemHealth?.message;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            A.E.B. / S4E RESTful API Dashboard
          </h1>
          <p className="text-gray-600">
            RESTful API with Job Queue and Web Crawler
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* System Commands Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                System Commands
              </CardTitle>
              <Terminal className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.osCommands}
                </div>
                <p className="text-sm text-gray-500">
                  Execute system commands and view outputs
                </p>
                <Link href="/commands">
                  <Button className="w-full" variant="outline">
                    Open Commands
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Web Crawler Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Web Crawler
              </CardTitle>
              <Globe className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-600">
                  {stats.crawls}
                </div>
                <p className="text-sm text-gray-500">
                  Crawl websites with Katana and analyze URLs
                </p>
                <Link href="/crawler">
                  <Button className="w-full" variant="outline">
                    Start Crawling
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Job History Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Job History
              </CardTitle>
              <History className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total}
                </div>
                <p className="text-sm text-gray-500">
                  View all executed jobs and their results
                </p>
                <Link href="/history">
                  <Button className="w-full" variant="outline">
                    View History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                System Status
              </CardTitle>
              <Activity className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`text-2xl font-bold ${isSystemOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isLoadingHealth ? '...' : isSystemOnline ? 'Online' : 'Offline'}
                </div>
                <p className="text-sm text-gray-500">
                  API connection status
                </p>
                <Badge variant={isSystemOnline ? 'default' : 'destructive'} className="w-full justify-center">
                  {isLoadingHealth ? 'Checking...' : isSystemOnline ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* System Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                API Status
              </CardTitle>
              {isSystemOnline ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1 ${isSystemOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isLoadingHealth ? '...' : isSystemOnline ? 'Online' : 'Offline'}
              </div>
              <p className="text-xs text-gray-500">
                Backend services
              </p>
            </CardContent>
          </Card>

          {/* Active/Pending Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Jobs
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {isLoadingJobs ? '...' : stats.pending}
              </div>
              <p className="text-xs text-gray-500">
                Jobs in queue
              </p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Success Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {isLoadingJobs ? '...' : stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-500">
                Success rate
              </p>
            </CardContent>
          </Card>

          {/* Total Executions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Jobs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {isLoadingJobs ? '...' : stats.total}
              </div>
              <p className="text-xs text-gray-500">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingJobs ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">Loading recent activity...</span>
                </div>
              ) : recentJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Execute some commands or start crawling to see activity here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {getJobIcon(job.job_name)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {formatJobName(job.job_name)}
                            </span>
                            <span className="text-sm text-gray-500">#{job.id}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(job.created_at || '').toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(job.status)}
                          <Badge 
                            variant={job.status === 'success' ? 'default' : 
                                   job.status === 'error' ? 'destructive' : 'secondary'}
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <Link href="/history">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
