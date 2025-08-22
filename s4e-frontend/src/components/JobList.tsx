import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Terminal, Globe, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface JobResult {

  id: number;
  job_name: string;
  status: string;
  created_at?: string;

}

interface JobListProps {

  jobs: JobResult[];
  isLoading?: boolean;

}

const JobList: React.FC<JobListProps> = ({ jobs, isLoading }) => {

  const getStatusBadge = (status: string) => {

    const statusConfig = {

      success: { 
        variant: 'default' as const, 
        icon: <CheckCircle className="w-3 h-3" />,
        className: 'bg-green-100 text-green-800 border-green-200'

      },

      error: { 

        variant: 'destructive' as const, 
        icon: <XCircle className="w-3 h-3" />,
        className: 'bg-red-100 text-red-800 border-red-200'

      },

      pending: { 

        variant: 'secondary' as const, 
        icon: <AlertCircle className="w-3 h-3" />,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getJobIcon = (jobName: string) => {

    switch (jobName) {

      case 'os_command':
        return <Terminal className="w-4 h-4 text-blue-500" />;
      case 'katana_crawl':
        return <Globe className="w-4 h-4 text-green-500" />;

      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;

    }
  };

  const formatDate = (dateString?: string) => {

    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {

    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">No Jobs Found</p>
          <p className="text-sm">Start by creating your first job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getJobIcon(job.job_name)}
                  <div>
                    <h3 className="font-semibold">
                      Job #{job.id} - {job.job_name.replace('_', ' ').toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(job.status)}
                
                <Link href={`/jobs/${job.id}`} passHref>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobList;
