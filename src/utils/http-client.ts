import request, { RequestPromise } from 'request-promise'

export type HttpRequest = {
    method: string;
    uri: string;
    headers?: { [key: string]: string };
    body?: object;
    json?: boolean;
}
export class HttpClient {
    async execute<T> (params: HttpRequest, responseMapper: (request: RequestPromise) => T): Promise<T> {
        const response = await request(params)
        return responseMapper(response)
    }
}