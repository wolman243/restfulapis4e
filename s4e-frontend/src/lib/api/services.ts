import { apiClient } from './client';
import {
  JobResult,
  JobCreateRequest,
  JobCreateResponse,
  JobsResponse,
  OSCommandData,
  KatanaCrawlData,
  JobResultsResponse
} from '@/types/api';

export const jobsApi = {

  getAllJobs: async (): Promise<JobsResponse> => {
    const response = await apiClient.get('/jobs');
    return response.data;
  },


  getJobById: async (id: number): Promise<JobResult> => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },


  createJob: async (data: JobCreateRequest): Promise<JobCreateResponse> => {
    const response = await apiClient.post('/jobs', data);
    return response.data;
  },


  createOSCommandJob: async (data: OSCommandData): Promise<JobCreateResponse> => {
    const response = await apiClient.post('/jobs', {
      job_name: 'os_command',
      data
    });
    return response.data;
  },


  createKatanaCrawlJob: async (data: KatanaCrawlData): Promise<JobCreateResponse> => {
    const response = await apiClient.post('/jobs', {
      job_name: 'katana_crawl',
      data
    });
    return response.data;
  },


  getAllJobResults: async (): Promise<JobResultsResponse> => {
    const response = await apiClient.get('/jobs/results');
    return response.data;
  },


  getJobResultById: async (id: number): Promise<JobResult> => {
    const response = await apiClient.get(`/jobs/results/${id}`);
    return response.data;
  },
};

export const systemApi = {

  healthCheck: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },
};
