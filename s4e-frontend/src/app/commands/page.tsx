'use client';

import { CommandOutput } from '@/components/CommandOutput';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, ArrowLeft, Play, Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useCreateOSCommandJob, useJobResults } from '@/lib/hooks/useJobs';
import { OSCommandData, ParsedOSCommandResult } from '@/types/api';
import { toast } from 'sonner';

const COMMAND_OPTIONS = [

  { key: 'list', label: 'List Directory (ls -la)', description: 'List all files and directories with details' },
  { key: 'current_dir', label: 'Current Directory (pwd)', description: 'Show current working directory' },
  { key: 'whoami', label: 'Current User (whoami)', description: 'Show current user name' },

] as const;

export default function CommandsPage() {

  const [selectedCommand, setSelectedCommand] = useState<string>('');
  const createOSCommandJob = useCreateOSCommandJob();
  const { data: jobResults, isLoading: isLoadingResults } = useJobResults();

  const handleExecuteCommand = async () => {

    if (!selectedCommand) {
      toast.error('Please select a command');
      return;

    }

    const commandData: OSCommandData = {

      command_key: selectedCommand as OSCommandData['command_key']
    };

    try {
      await createOSCommandJob.mutateAsync(commandData);
      setSelectedCommand('');

    } catch (error) {
      console.error('Failed to execute command:', error);
    }
  };

  const osCommandResults = jobResults?.filter(job => job.job_name === 'os_command') || [];

  const parseCommandResult = (result: string): ParsedOSCommandResult => {

    try {
      return JSON.parse(result);

    } catch {
      return { status: 'error', message: 'Failed to parse result' };
    }

  };

  const renderCommandOutput = (job: any, parsedResult: any) => {

    return (
      <CommandOutput 
        result={parsedResult}
        jobId={job.id}
        timestamp={new Date(job.created_at).toLocaleString()}
      />

    );
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
            <Terminal className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">System Commands</h1>
          </div>
          <p className="text-gray-600">Execute system commands and view their outputs</p>
        </div>

        <Tabs defaultValue="execute" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="execute">Execute Commands</TabsTrigger>
            <TabsTrigger value="history">Command History</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-6">
            {/* Command Execution Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Execute System Command
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Command:</label>
                  <Select value={selectedCommand} onValueChange={setSelectedCommand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a command to execute" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMAND_OPTIONS.map((cmd) => (
                        <SelectItem key={cmd.key} value={cmd.key}>
                          <div>
                            <div className="font-medium">{cmd.label}</div>
                            <div className="text-xs text-gray-500">{cmd.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleExecuteCommand}
                  disabled={!selectedCommand || createOSCommandJob.isPending}
                  className="w-full"
                >
                  {createOSCommandJob.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Command
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Command History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Command History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingResults ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading command history...</p>
                  </div>
                ) : osCommandResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No commands executed yet</p>
                    <p className="text-sm">Execute some commands to see the history here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {osCommandResults.map((job) => {
                      const parsedResult = parseCommandResult(job.result || '{}');
                      const commandOption = COMMAND_OPTIONS.find(cmd => 
                        job.result?.includes(`"command_key":"${cmd.key}"`) || 
                        parsedResult.output?.includes(cmd.key)
                      );

                      return (
                        <div key={job.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(job.status)}
                              <div>
                                <p className="font-medium">
                                  {commandOption?.label || 'Unknown Command'}
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

                          {parsedResult.output && (
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                              <pre>{parsedResult.output}</pre>
                            </div>
                          )}

                          {parsedResult.message && parsedResult.status === 'error' && (
                            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">
                              <strong>Error:</strong> {parsedResult.message}
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
