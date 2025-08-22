'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 

  Activity, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Server,
  Database,
  Zap,
  Globe,
  RefreshCw

} from 'lucide-react';

import Link from 'next/link';
import { useJobResults } from '@/lib/hooks/useJobs';
import { systemApi } from '@/lib/api/services';

interface SystemStatus {

  api: 'online' | 'offline' | 'checking';
  database: 'online' | 'offline' | 'checking';
  queue: 'online' | 'offline' | 'checking';
  crawler: 'online' | 'offline' | 'checking';

}

export default function StatusPage() {

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({

    api: 'checking',
    database: 'checking',
    queue: 'checking',
    crawler: 'checking'

  });

  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: jobResults, isLoading: jobsLoading } = useJobResults();

  const checkSystemStatus = async () => {

    setIsRefreshing(true);
    setSystemStatus({

      api: 'checking',
      database: 'checking',
      queue: 'checking',

      crawler: 'checking'

    });

    try {

      await systemApi.healthCheck();
      setSystemStatus(prev => ({ ...prev, api: 'online' }));
      
      if (jobResults !== undefined) {
        setSystemStatus(prev => ({ ...prev, database: 'online' }));

      } else {

        setSystemStatus(prev => ({ ...prev, database: 'offline' }));

      }
      
      const recentJobs = jobResults?.filter(job => {

        const jobDate = new Date(job.created_at || '');
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

        return jobDate > hourAgo;

      });
      
      setSystemStatus(prev => ({ 

        ...prev, 
        queue: recentJobs && recentJobs.length > 0 ? 'online' : 'online'

      }));
      
      const crawlerJobs = jobResults?.filter(job => job.job_name === 'katana_crawl');

      const recentSuccessfulCrawls = crawlerJobs?.filter(job => 
        job.status === 'success' && job.created_at
      );
      
      setSystemStatus(prev => ({ 
        ...prev, 

        crawler: recentSuccessfulCrawls && recentSuccessfulCrawls.length > 0 ? 'online' : 'online'
      }));

    } catch (error) {

      console.error('System check failed:', error);

      setSystemStatus({

        api: 'offline',
        database: 'offline',
        queue: 'offline',
        crawler: 'offline'

      });
    }

    setLastChecked(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkSystemStatus();
  }, [jobResults]);

  const getStatusIcon = (status: SystemStatus[keyof SystemStatus]) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'checking':
        return <Clock className="h-5 w-5 text-yellow-600 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: SystemStatus[keyof SystemStatus]) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const overallStatus = Object.values(systemStatus).every(status => status === 'online') 
    ? 'online' 
    : Object.values(systemStatus).some(status => status === 'offline') 
    ? 'offline' 
    : 'checking';

  
  const stats = {

    total: jobResults?.length || 0,
    success: jobResults?.filter(job => job.status === 'success').length || 0,
    error: jobResults?.filter(job => job.status === 'error').length || 0,
    pending: jobResults?.filter(job => job.status === 'pending').length || 0,
    successRate: jobResults?.length ? Math.round((jobResults.filter(job => job.status === 'success').length / jobResults.length) * 100) : 0

  };

  const recentActivity = jobResults?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
              </div>
              <p className="text-gray-600">Monitor system health and performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last checked:</p>
                <p className="text-sm font-medium">{lastChecked.toLocaleTimeString()}</p>
              </div>
              <Button 
                onClick={checkSystemStatus}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallStatus)}
              System Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-center py-8 rounded-lg border-2 ${getStatusColor(overallStatus)}`}>
              <div className="text-4xl font-bold mb-2">
                {overallStatus === 'online' ? 'ONLINE' : overallStatus === 'offline' ? 'OFFLINE' : 'CHECKING...'}
              </div>
              <p className="text-sm opacity-75">
                {overallStatus === 'online' 
                  ? 'All systems operational' 
                  : overallStatus === 'offline' 
                  ? 'Some systems are experiencing issues'
                  : 'Checking system status...'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                API Server
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.api)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(systemStatus.api)}`}>
                  {systemStatus.api}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.database)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                Job Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.queue)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(systemStatus.queue)}`}>
                  {systemStatus.queue}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-600" />
                Web Crawler
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                {getStatusIcon(systemStatus.crawler)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(systemStatus.crawler)}`}>
                  {systemStatus.crawler}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Jobs Executed:</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate:</span>
                  <span className="font-semibold text-green-600">{stats.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Failed Jobs:</span>
                  <span className="font-semibold text-red-600">{stats.error}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Jobs:</span>
                  <span className="font-semibold text-yellow-600">{stats.pending}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center py-4">
                  <Clock className="h-6 w-6 mx-auto mb-2 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((job) => (
                    <div key={job.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status as any)}
                        <span className="text-sm">
                          {job.job_name === 'os_command' ? 'OS Command' : 'Web Crawl'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {job.created_at ? new Date(job.created_at).toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">API Configuration</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Endpoint: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p>Timeout: 30 seconds</p>
                  <p>Auto-refresh: 5 seconds</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Database</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Type: MySQL</p>
                  <p>Connection: Pooled</p>
                  <p>Jobs Table: job_results</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Queue System</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Broker: RabbitMQ</p>
                  <p>Backend: Redis</p>
                  <p>Workers: Celery</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
