import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { JobResult } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useJobDetail = (jobId: number) => {
  return useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async (): Promise<JobResult> => {
      const response = await axios.get(`${API_BASE_URL}/jobs/results/${jobId}`);
      return response.data;
    },
    enabled: !!jobId, 
    refetchInterval: (data) => {

      return data?.status === 'pending' ? 3000 : false;
    }
  });
};


export const useJobResults = () => {
  return useQuery({
    queryKey: ['job-results'],
    queryFn: async (): Promise<JobResult[]> => {
      const response = await axios.get(`${API_BASE_URL}/jobs/results`);
      return response.data;
    },
    refetchInterval: 5000 
  });
};
