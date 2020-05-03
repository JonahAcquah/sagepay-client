import merchantSessionKey from '../../src/utils/merchant-session-key'
import { ConfigOptions } from '../../src/client/configOptions'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('defult', () => {
    test(`
        WHEN default function is called
        THEN a new merchant session key should return
    `, async () => {
        const expectedResponse = {
            merchantSessionKey: 'test-merchant-session-key',
            expiry: new Date('19700301')
        }

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: jest.fn(() => Promise.resolve(expectedResponse))
            }
        } as any as ConfigOptions

        const base64Creds = Buffer.from('test-user-name:test-password').toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }
        
        const f = merchantSessionKey(opt)
        const sessionKey = await f()

        expect(sessionKey).toEqual(expectedResponse)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/merchant-session-keys',
            headers,
            body: { vendorName: 'test-vendor-name' },
            json: true
        }, expect.any(Function))
    })
})