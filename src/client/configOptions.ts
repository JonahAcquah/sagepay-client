import { HttpClient } from '../utils/http-client'
import { Logger } from '../utils/logger'

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
    logger?: Logger;
    maxRetries?: number;
    headers?: { [key: string]: string };
}