import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api/services';
import { JobCreateRequest, OSCommandData, KatanaCrawlData } from '@/types/api';
import { toast } from 'sonner';


export const jobsKeys = {
  all: ['jobs'] as const,

  lists: () => [...jobsKeys.all, 'list'] as const,
  list: (filters: string) => [...jobsKeys.lists(), { filters }] as const,
  details: () => [...jobsKeys.all, 'detail'] as const,
  detail: (id: number) => [...jobsKeys.details(), id] as const,
  results: () => [...jobsKeys.all, 'results'] as const,
  result: (id: number) => [...jobsKeys.results(), id] as const,
};


export const useJobs = () => {
  return useQuery({
    queryKey: jobsKeys.lists(),
    queryFn: jobsApi.getAllJobs,
    refetchInterval: 5000, 
    staleTime: 3000,
  });
};


export const useJob = (id: number) => {
  return useQuery({
    queryKey: jobsKeys.detail(id),
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
    refetchInterval: 2000, 
  });
};


export const useJobResults = () => {

  return useQuery({
    queryKey: jobsKeys.results(),
    queryFn: jobsApi.getAllJobResults,
    refetchInterval: 5000,
    staleTime: 3000,
  });
};


export const useJobResult = (id: number) => {

  return useQuery({
    queryKey: jobsKeys.result(id),
    queryFn: () => jobsApi.getJobResultById(id),
    enabled: !!id,
  });
};


export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobCreateRequest) => jobsApi.createJob(data),
    onSuccess: (data) => {

      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobsKeys.results() });
      
      toast.success("Job Created", {
        description: `Job queued successfully! Task ID: ${data.task_id}`,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create job",
      });
    },
  });
};


export const useCreateOSCommandJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OSCommandData) => jobsApi.createOSCommandJob(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobsKeys.results() });
      
      toast.success("OS Command Job Created", {
        description: `Command job queued! Task ID: ${data.task_id}`,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create OS command job",
      });
    },
  });
};


export const useCreateKatanaCrawlJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: KatanaCrawlData) => jobsApi.createKatanaCrawlJob(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobsKeys.results() });
      
      toast.success("Crawler Job Created", {
        description: `Crawler job queued! Task ID: ${data.task_id}`,
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.error || "Failed to create crawler job",
      });
    },
  });
};
