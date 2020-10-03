import { linkCardIdentifier } from '../../src/transactions/link-card-identifier'
import { ConfigOptions } from '../../src/client/configOptions'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('linkCardIdentifier', () => {
    test(`
        WHEN default function is called
        AND link card is requested
        AND securitycode is provided
        THEN a link card action should execute
        AND merchantSessionKey should return
    `, async () => {

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: jest.fn(() => Promise.resolve())
            }
        } as any as ConfigOptions

        const headers = {
            ...opt.headers,
            Authorization: 'Bearer test-merchant-session-key'
        }

        const getSessionKeyFn = () => Promise.resolve({
            merchantSessionKey: 'test-merchant-session-key',
            expiry: new Date()
        })

        const f = linkCardIdentifier(opt, getSessionKeyFn)

        const sessionKey = await f({
            securityCode: 'test-security-code',
            cardIdentifier: 'test-card-identifier'
        })
        
        expect(sessionKey).toEqual('test-merchant-session-key')
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/card-identifiers/test-card-identifier/security-code',
            headers,
            body: { securityCode: 'test-security-code' },
            json: true
        }, expect.any(Function))
    })
})