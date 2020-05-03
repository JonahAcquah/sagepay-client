import { HttpClient } from '../utils/http-client'

export interface ConfigOptions extends SagePayOptions {
    httpClient: HttpClient;
    maxRetries: number;
    headers: { [key: string]: string };
}

export interface SagePayOptions {
    baseUrl: string;
    username: string;
    password: string;
    vendorName: string;
    httpClient?: HttpClient;
    maxRetries?: number;
    headers?: { [key: string]: string };
}