import cardIdentifier from '../../src/utils/card-identifer'
import { ConfigOptions } from '../../src/client/configOptions'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('defult', () => {
    test(`
        WHEN default function is called
        AND a merchant session key is provided
        THEN a new card identifier is returned
    `, async () => {
        const expectedResponse = {}
        const expectedMerchantResponse = {
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

        const headers = {
            ...opt.headers,
            Authorization: 'Bearer test-merchant-session-key'
        }

        const cardInput = {
            cardDetails: {
                cardNumber: '1234 5678 9101 2345',
                cardholderName: 'test-card holder-name',
                securityCode: '123',
                expiryDate: '12/09'
            }
        }
        
        const sessionKeyFn = () => Promise.resolve(expectedMerchantResponse)
        const f = cardIdentifier(opt, sessionKeyFn)
        const sessionKey = await f(cardInput)

        expect(sessionKey).toEqual(expectedResponse)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/card-identifiers',
            headers,
            body: { ...cardInput },
            json: true
        }, expect.any(Function))
    })
})