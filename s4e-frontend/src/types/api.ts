
export interface JobResult {
  id: number;
  job_name: string;
  status: string;
  result?: string;
  created_at?: string;
  updated_at?: string;
}

export interface JobCreateRequest {
  job_name: string;
  data?: Record<string, any>;
}


export interface JobCreateResponse {
  message: string;
  task_id: string;
}

export interface JobsResponse {
  jobs: JobResult[];
}


export type JobResultsResponse = JobResult[];


export interface OSCommandData {
  command_key: 'list' | 'current_dir' | 'whoami';
}


export interface KatanaCrawlData {
  url: string;
}


export interface HealthCheckResponse {
  message: string;
}


export enum JobStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
  RUNNING = 'running'
}


export interface ParsedOSCommandResult {
  status: string;
  output?: string;
  message?: string;
}

export interface ParsedKatanaCrawlResult {
  status: string;
  target?: string;
  url_count?: number;
  message?: string;
}
