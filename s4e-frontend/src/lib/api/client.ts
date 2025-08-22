import axios, { AxiosInstance } from 'axios';

class ApiClient {

  private client: AxiosInstance;

  constructor() {

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log(`API Base URL: ${baseURL}`);

    this.client = axios.create({

      baseURL,
      timeout: 30000,

      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(

      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Request data:', config.data); 

        return config;

      },

      (error) => {

        console.error('API Request Error:', error);

        return Promise.reject(error);

      }
    );

    this.client.interceptors.response.use(

      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        console.log('Response data:', response.data); 

        return response;
      },

      (error) => {
        console.error('API Response Error:', error.response?.data || error.message);
        console.error('Full error:', error);

        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
