import axios, { type AxiosInstance } from 'axios';
import AppConfig from '../constants';
import { StoreManager } from '@/stores/store-manager';
interface IStatusCode {
  [code: string]: number;
}

let apiClient: AxiosInstance | undefined;
let apiToken: string | undefined;

export function setApiToken(token: string): void {
  if (!token || token === '') return;
  apiToken = token;
  if (apiClient) apiClient.defaults.headers.common['Authorization'] = `BK_THEATER ` + token;
}

export function setApiBaseUrl(url: string): void {
  if (apiClient) apiClient.defaults.baseURL = url;
}

export const getApiHeader = () => {
  const header = {
    'Content-type': 'application/json',
  };
  if (apiToken) Object.assign(header, { Authorization: `BK_THEATER ${apiToken}` });

  return {
    headers: header,
  };
};

export const removeApiToken = () => {
  apiToken = undefined;
  if (apiClient) apiClient.defaults.headers.common['Authorization'] = '';
};

export const getApiFileHeader = () => {
  const header = {
    'Content-type': 'multipart/form-data',
  };
  if (apiToken) Object.assign(header, { Authorization: `BK_THEATER ${apiToken}` });

  return {
    headers: header,
  };
};

export function getApiClient(baseUrl = AppConfig.API_SERVER, storeManager?: StoreManager): AxiosInstance {
  if (!apiClient) {
    apiClient = axios.create({
      baseURL: AppConfig.API_SERVER,
      headers: {
        'Content-type': 'application/json',
      },
    });
  }

  setApiBaseUrl(baseUrl);

  if (storeManager?.dataStore.authToken) setApiToken(storeManager.dataStore.authToken);

  return apiClient;
}

export const statusCode: IStatusCode = {
  OK: 200,
  ERROR: 500,
};
