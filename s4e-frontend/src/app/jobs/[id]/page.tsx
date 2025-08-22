'use client';

import { useParams, useRouter } from 'next/navigation';
import { useJobDetail } from '@/lib/api/hooks';
import JobDetails from '@/components/JobDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function JobDetailPage() {

  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  
  const { data: job, isLoading, error } = useJobDetail(jobId);

  if (isLoading) {

    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading job details...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold mb-2">Error Loading Job</p>
              <p className="text-sm text-gray-600">
                Could not load details for job #{jobId}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center text-gray-600">
            Job not found
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Job Details</h1>
      </div>
      
      <JobDetails job={job} />
    </div>
  );
}
