import request from 'request-promise'
import { Logger } from './logger'

export type HttpRequest = {
    method: string;
    uri: string;
    headers?: { [key: string]: string };
    body?: object;
    json?: boolean;
}
export class HttpClient {
    constructor(private readonly logger?: Logger){
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute<T> (params: HttpRequest, responseMapper: (request: any) => T): Promise<T> {
        this.logger?.info(JSON.stringify(params))
        const response = await request(params)
        this.logger?.info(JSON.stringify(response))
        
        return responseMapper(response)
    }
}