import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Terminal, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface JobResult {

  id: number;
  job_name: string;
  status: string;
  result?: string;
  created_at?: string;
  updated_at?: string;

}

interface ParsedResult {

  status: string;
  output?: string;
  command?: string;
  message?: string;
  target?: string;
  url_count?: number;
  urls?: string[];
  method?: string;

}

interface JobDetailsProps {

  job: JobResult;

}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {

  const parseResult = (): ParsedResult | null => {

    if (!job.result) return null;

    try {
      return JSON.parse(job.result);

    } catch (error) {
      console.error('Failed to parse job result:', error);

      return null;
    }
  };

  const parsedResult = parseResult();

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getJobIcon = (jobName: string) => {

    switch (jobName) {

      case 'os_command':
        return <Terminal className="w-5 h-5 text-blue-500" />;
      case 'katana_crawl':
        return <Globe className="w-5 h-5 text-green-500" />;

      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;

    }
  };

  return (
    <div className="space-y-6">
      {/* Job Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getJobIcon(job.job_name)}
              <div>
                <CardTitle className="text-xl">Job #{job.id}</CardTitle>
                <CardDescription>{job.job_name.replace('_', ' ').toUpperCase()}</CardDescription>
              </div>
            </div>
            {getStatusBadge(job.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Created:</span>
              <span className="font-mono">{formatDate(job.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Updated:</span>
              <span className="font-mono">{formatDate(job.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Result Details */}
      {parsedResult && (
        <Card>
          <CardHeader>
            <CardTitle>Job Results</CardTitle>
            <CardDescription>Detailed output and information from the job execution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OS Command Results */}
            {job.job_name === 'os_command' && parsedResult.output && (
              <div className="space-y-3">
                {parsedResult.command && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Command Executed:</label>
                    <code className="block p-2 bg-gray-100 rounded text-sm font-mono border">
                      {parsedResult.command}
                    </code>
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Output:</label>
                  <ScrollArea className="h-64 w-full">
                    <pre className="p-4 bg-black text-green-400 rounded text-xs font-mono whitespace-pre-wrap border">
                      {parsedResult.output}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            )}

            {/* Katana Crawl Results */}
            {job.job_name === 'katana_crawl' && (
              <div className="space-y-3">
                {parsedResult.target && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Target URL:</label>
                    <code className="block p-2 bg-gray-100 rounded text-sm font-mono border">
                      {parsedResult.target}
                    </code>
                  </div>
                )}
                
                {parsedResult.url_count !== undefined && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">URLs Found:</label>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {parsedResult.url_count} URLs
                    </Badge>
                  </div>
                )}

                {parsedResult.method && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Method Used:</label>
                    <Badge variant="secondary">
                      {parsedResult.method}
                    </Badge>
                  </div>
                )}

                {parsedResult.urls && parsedResult.urls.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Discovered URLs:</label>
                    <ScrollArea className="h-48 w-full border rounded">
                      <div className="p-3 space-y-1">
                        {parsedResult.urls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm">
                            <Badge variant="outline" className="text-xs shrink-0">
                              {index + 1}
                            </Badge>
                            <code className="font-mono text-blue-600 break-all">
                              {url}
                            </code>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {parsedResult.status === 'error' && parsedResult.message && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-red-700 mb-1 block">Error Message:</label>
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {parsedResult.message}
                </div>
              </div>
            )}

            {/* Raw JSON for debugging */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-800">
                View Raw JSON Data
              </summary>
              <ScrollArea className="mt-2 h-32">
                <pre className="p-3 bg-gray-50 rounded text-xs font-mono border overflow-auto">
                  {JSON.stringify(parsedResult, null, 2)}
                </pre>
              </ScrollArea>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobDetails;
