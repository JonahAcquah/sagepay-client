import { refundPayment } from '../../src/transactions/refund-payment'
import { ConfigOptions } from '../../src/client/configOptions'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('default', () => {
    test(`
        WHEN default function is called
        AND payment type is refund
        THEN a transaction payment confirmation is returned
    `, async () => {
        const paymentOutput = {
            "transactionId": "DB79BA2D-05DA-5B85-D188-1293D16BBAC7",
            "transactionType": "Payment",
            "status": "Ok",
            "statusCode": 0,
            "statusDetail": "The Authorisation was Successful.",
            "retrievalReference": 9493946,
            "bankResponseCode": 0,
            "bankAuthorisationCode": 999777,
            "avsCvsCheck": 
            {
                "status": "AllMatched",
                "address": "Matched",
                "postalCode": "Matched",
                "securityCode": "Matched"

            },
            "paymentMethod": 
            {
                "card": {
                    "merchantSessionKey": 'test-merchant-session-key',
                    "cardIdentifier": 'card-identifier',
                    "reusable": false,
                    "save": false
                }
            },
            "amount": {
                "totalAmount": 567,
                "saleAmount": 897,
                "surchargeAmount": 234
            },
            "currency": "GBP",
            "3DSecure": 
            {
                "status": "Authenticated"
            }
        }

        const refundPaymentInput = {
            "transactionType": "Refund",
            "referenceTransactionId": "56A59178-EA46-5731-BBAF-B08415CCE499",
            "vendorTxCode": "demotransaction99",
            "amount": 4,
            "description": "Demo transaction"
        }

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: jest.fn(() => Promise.resolve(paymentOutput))
            }
        } as any as ConfigOptions

        const base64Creds = Buffer.from(`test-user-name:test-password`).toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const f = refundPayment(opt)
        const sessionKey = await f(refundPaymentInput)
        
        expect(sessionKey).toEqual(paymentOutput)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions',
            headers,
            body: { ...refundPaymentInput },
            json: true
        }, expect.any(Function))
    })
})