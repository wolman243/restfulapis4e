'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, ArrowLeft, Play, Clock, CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCreateKatanaCrawlJob, useJobResults } from '@/lib/hooks/useJobs';
import { KatanaCrawlData, ParsedKatanaCrawlResult } from '@/types/api';
import { toast } from 'sonner';

export default function CrawlerPage() {

  const [targetUrl, setTargetUrl] = useState('');
  const createCrawlJob = useCreateKatanaCrawlJob();
  const { data: jobResults, isLoading: isLoadingResults } = useJobResults();

  const handleStartCrawl = async () => {
    if (!targetUrl.trim()) {
      toast.error('Please enter a URL to crawl');
      return;
    }

    try {
      new URL(targetUrl);

    } catch {
      toast.error('Please enter a valid URL (include http:// or https://)');
      return;
    }

    const crawlData: KatanaCrawlData = {

      url: targetUrl.trim()
    };

    try {

      await createCrawlJob.mutateAsync(crawlData);
      setTargetUrl('');

    } catch (error) {
      console.error('Failed to start crawl:', error);
    }
  };

  const crawlResults = jobResults?.filter(job => job.job_name === 'katana_crawl') || [];

  const parseCrawlResult = (result: string): ParsedKatanaCrawlResult => {
    try {
      return JSON.parse(result);
    } catch {
      return { status: 'error', message: 'Failed to parse result' };
    }
  };

  const getStatusIcon = (status: string) => {

    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {

    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Web Crawler</h1>
          </div>
          <p className="text-gray-600">Crawl websites using Katana and discover URLs</p>
        </div>

        <Tabs defaultValue="crawl" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crawl">Start Crawl</TabsTrigger>
            <TabsTrigger value="history">Crawl History</TabsTrigger>
          </TabsList>

          <TabsContent value="crawl" className="space-y-6">
            {/* Crawl Execution Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Start Web Crawl
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target URL:</label>
                  <Input
                    placeholder="https://example.com"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    Enter a complete URL including protocol (http:// or https://)
                  </p>
                </div>

                <Button 
                  onClick={handleStartCrawl}
                  disabled={!targetUrl.trim() || createCrawlJob.isPending}
                  className="w-full"
                >
                  {createCrawlJob.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Starting Crawl...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Crawl
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">About Web Crawling</p>
                    <p>
                      The crawler will discover and collect URLs from the target website. 
                      This process may take some time depending on the size of the website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Crawl History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Crawl History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResults ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto mb-4 animate-spin text-green-600" />
                    <p className="text-gray-600">Loading crawl history...</p>
                  </div>
                ) : crawlResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No crawls executed yet</p>
                    <p className="text-sm">Start crawling websites to see the history here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {crawlResults.map((job) => {
                      const parsedResult = parseCrawlResult(job.result || '{}');

                      return (
                        <div key={job.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(job.status)}
                              <div>
                                <p className="font-medium flex items-center gap-2">
                                  <LinkIcon className="h-4 w-4" />
                                  {parsedResult.target || 'Unknown URL'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {job.created_at ? new Date(job.created_at).toLocaleString() : 'No date'}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>

                          {parsedResult.status === 'success' && parsedResult.url_count !== undefined && (
                            <div className="bg-green-50 text-green-700 p-3 rounded text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4" />
                                <strong>Crawl Completed Successfully</strong>
                              </div>
                              <p>
                                <strong>Target:</strong> {parsedResult.target}
                              </p>
                              <p>
                                <strong>URLs Found:</strong> {parsedResult.url_count} URLs
                              </p>
                            </div>
                          )}

                          {parsedResult.message && parsedResult.status === 'error' && (
                            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-4 w-4" />
                                <strong>Crawl Failed</strong>
                              </div>
                              <p>{parsedResult.message}</p>
                            </div>
                          )}

                          {job.status === 'pending' && (
                            <div className="bg-yellow-50 text-yellow-700 p-3 rounded text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4 animate-spin" />
                              <span>Crawl in progress...</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
