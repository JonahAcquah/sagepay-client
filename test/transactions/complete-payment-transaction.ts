import { completePayment } from '../../src/transactions/complete-payment-transaction'
import { ConfigOptions } from '../../src/client/configOptions'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('completePayment', () => {
    test(`
        WHEN completePayment is called
        AND a paRes is provided
        THEN the status of 3DSecure transaction should return
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

        const mockExecute = jest.fn()
        mockExecute
        .mockReturnValueOnce(Promise.resolve({
            status: 'Authenticated'
        }))
        .mockReturnValueOnce(Promise.resolve(paymentOutput))

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: mockExecute
            }
        } as any as ConfigOptions

        const base64Creds = Buffer.from(`test-user-name:test-password`).toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const completePaymentTransactionInput = {
            transactionid: 'test-transaction-id',
            paRes: 'test-pa-res'
        }
        
        const f = completePayment(opt)
        const response = await f(completePaymentTransactionInput)

        expect(response).toEqual(paymentOutput)
        expect(mockExecute.mock.calls[0][0]).toEqual({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions/test-transaction-id/3d-secure',
            headers,
            body: { 
                paRes: 'test-pa-res'
             },
            json: true
        })

        expect(mockExecute.mock.calls[1][0]).toEqual({
            method: 'GET',
            uri: 'http://test-base-url/api/v1/transactions/test-transaction-id',
            headers
        })
    })
})