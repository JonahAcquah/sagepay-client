import { makePayment } from '../../src/transactions/make-payment'
import { ConfigOptions } from '../../src/client/configOptions'
import { Apply3DSecureOptions, EntryMethod } from '../../src/client/payment-transaction'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('default - New Card', () => {
    test(`
        WHEN default function is called
        AND a merchant session key is provided
        AND a new card identifier is returned
        AND payment type is not 3D
        THEN a transaction payment confirmation is returned
    `, async () => {
        const expectedCardIdentierResponse = {
            cardIdentifier: 'test-card-identifier',
            expiry: '12/22',
            cardType: 'visa',
            merchantSessionKey: 'test-session-key-used'
        }

        const cardInput = {
            cardDetails: {
                cardNumber: '1234 5678 9101 2345',
                cardholderName: 'test-card holder-name',
                securityCode: '123',
                expiryDate: '12/09',
                saveCard: true
            }
        }

        const paymentInput = {
            transactionType: 'test-transaction-type',
            vendorTxCode: 'test-vendor-tx-code',
            amount: 200.50,
            currency: 'GBP',
            description: 'test-description',
            customerFirstName: 'customer-first-name',
            customerLastName: 'customer-last-name',
            billingAddress: {
                address1: 'test-address-1',
                city: 'test-city',
                postalCode: 'test-postal-code',
                country: 'UK'
            },
            entryMethod: EntryMethod.Ecommerce,
            giftAid: false,
            apply3DSecure: Apply3DSecureOptions.UseMSPSetting,
            applyAvsCvcCheck: 'Force',
            customerEmail: 'aa@aa.com',
            customerPhone: '012789345',
            customerWorkPhone: 'o12345678',
            referrerId: 'test-referrer-id',
            customerMobilePhone: '012345678'
        }

        const expectedBody = { 
            ...paymentInput,
            paymentMethod: {
                card: {
                    merchantSessionKey: expectedCardIdentierResponse.merchantSessionKey,
                    cardIdentifier: expectedCardIdentierResponse.cardIdentifier,
                    save: true
                }
            } 
        }

        const paymentOutput = {
            'transactionId': 'DB79BA2D-05DA-5B85-D188-1293D16BBAC7',
            'transactionType': 'Payment',
            'status': 'Ok',
            'statusCode': 0,
            'statusDetail': 'The Authorisation was Successful.',
            'retrievalReference': 9493946,
            'bankResponseCode': 0,
            'bankAuthorisationCode': 999777,
            'avsCvsCheck': 
            {
                'status': 'AllMatched',
                'address': 'Matched',
                'postalCode': 'Matched',
                'securityCode': 'Matched'

            },
            'paymentMethod': 
            {
                'card': {
                    'cardType': 'visa',
                    'cardIdentifier': 'card-identifier',
                    'expiryDate': '12/22',
                    'lastFourtDigits': '0004',
                    'reusable': true,
                }
            },
            'amount': {
                'totalAmount': 567,
                'saleAmount': 897,
                'surchargeAmount': 234
            },
            'currency': 'GBP',
            '3DSecure': 
            {
                'status': 'Authenticated'
            }
        }

        const payment = {
            card: cardInput,
            payment: paymentInput
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

        const base64Creds = Buffer.from('test-user-name:test-password').toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const cardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse)
        const linkCardIdentifierFn = () => Promise.resolve('test-session-key-used')

        const f = makePayment(opt, cardIdentifierFn, linkCardIdentifierFn)
        const sessionKey = await f(payment)
        
        expect(sessionKey).toEqual(paymentOutput)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions',
            headers,
            body: { ...expectedBody },
            json: true
        }, expect.any(Function))
    })

    test(`
        WHEN default function is called
        AND a merchant session key is provided
        AND a new card identifier is returned
        AND payment type is 3D
        THEN a 3D secure response is returned
    `, async () => {
        const expectedCardIdentierResponse = {
            cardIdentifier: 'test-card-identifier',
            cardType: '12/22',
            merchantSessionKey: 'test-session-key-used'
        }

        const cardInput = {
            cardDetails: {
                cardNumber: '1234 5678 9101 2345',
                cardholderName: 'test-card holder-name',
                securityCode: '123',
                expiryDate: '12/09',
                saveCard: true
            }
        }

        const paymentInput = {
            transactionType: 'test-transaction-type',
            vendorTxCode: 'test-vendor-tx-code',
            amount: 200.50,
            currency: 'GBP',
            description: 'test-description',
            customerFirstName: 'customer-first-name',
            customerLastName: 'customer-last-name',
            billingAddress: {
                address1: 'test-address-1',
                city: 'test-city',
                postalCode: 'test-postal-code',
                country: 'UK'
            },
            entryMethod: EntryMethod.Ecommerce,
            giftAid: false,
            apply3DSecure: Apply3DSecureOptions.UseMSPSetting,
            applyAvsCvcCheck: 'Force',
            customerEmail: 'aa@aa.com',
            customerPhone: '012789345',
            customerWorkPhone: '012345678',
            referrerId: 'test-referrer-id',
            customerMobilePhone: '012345678'
        }

        const expectedBody = { 
            ...paymentInput,
            paymentMethod: {
                card: {
                    merchantSessionKey: expectedCardIdentierResponse.merchantSessionKey,
                    cardIdentifier: expectedCardIdentierResponse.cardIdentifier,
                    save: true
                }
            } 
        }

        const payment3DSecureOutput = {
            statusCode: 2021,
            statusDetail: 'Please redirect your customer to the ACSURL to complete the 3DS Transaction',
            transactionId: 'DB79BA2D-05DA-5B85-D188-1293D16BBAC7',
            acsUrl: 'https://url-to-be-confirmed/html_challenge',
            cReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiIwZDUzZjA2Ni1jMDc2LTRkOGItYjcyMi04ZThhOWE0ZWE1NTIiLCJhY3NUcmFuc0lEIjoiMjdiNDlkMTgtMmE4Yi00OGIxLWE4ZTYtNzU3MzlkNmMwNDRiIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
            status: '3DAuth'
        }

        const payment = {
            card: cardInput,
            payment: paymentInput
        }

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: jest.fn(() => Promise.resolve(payment3DSecureOutput))
            }
        } as any as ConfigOptions

        const base64Creds = Buffer.from('test-user-name:test-password').toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const cardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse)
        const linkCardIdentifierFn = () => Promise.resolve('test-session-key-used')

        const f = makePayment(opt, cardIdentifierFn, linkCardIdentifierFn)
        const sessionKey = await f(payment)
        
        expect(sessionKey).toEqual(payment3DSecureOutput)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions',
            headers,
            body: { ...expectedBody },
            json: true
        }, expect.any(Function))
    })
})

describe('default - Reuse Card', () => {
    test(`
        WHEN default function is called
        AND a merchant session key is provided
        AND an existing card identifier is returned
        AND payment type is not 3D
        THEN a transaction payment confirmation is returned
    `, async () => {
        const expectedCardIdentierResponse = {
            cardIdentifier: 'test-card-identifier',
            expiry: new Date(),
            cardType: '12/22',
            merchantSessionKey: 'test-session-key-used'
        }

        const cardInput = {
            cardDetails: {
                cardIdentifier: 'test-card-identifier',
                securityCode: 'test-security-code'
            }
        }

        const paymentInput = {
            transactionType: 'test-transaction-type',
            vendorTxCode: 'test-vendor-tx-code',
            amount: 200.50,
            currency: 'GBP',
            description: 'test-description',
            customerFirstName: 'customer-first-name',
            customerLastName: 'customer-last-name',
            billingAddress: {
                address1: 'test-address-1',
                city: 'test-city',
                postalCode: 'test-postal-code',
                country: 'UK'
            },
            entryMethod: EntryMethod.Ecommerce,
            giftAid: false,
            apply3DSecure: Apply3DSecureOptions.UseMSPSetting,
            applyAvsCvcCheck: 'Force',
            customerEmail: 'aa@aa.com',
            customerPhone: '012789345',
            customerWorkPhone: 'o12345678',
            referrerId: 'test-referrer-id',
            customerMobilePhone: '012345678'
        }

        const expectedBody = { 
            ...paymentInput,
            paymentMethod: {
                card: {
                    merchantSessionKey: expectedCardIdentierResponse.merchantSessionKey,
                    cardIdentifier: expectedCardIdentierResponse.cardIdentifier,
                    save: true
                }
            } 
        }

        const paymentOutput = {
            'transactionId': 'DB79BA2D-05DA-5B85-D188-1293D16BBAC7',
            'transactionType': 'Payment',
            'status': 'Ok',
            'statusCode': 0,
            'statusDetail': 'The Authorisation was Successful.',
            'retrievalReference': 9493946,
            'bankResponseCode': 0,
            'bankAuthorisationCode': 999777,
            'avsCvsCheck': 
            {
                'status': 'AllMatched',
                'address': 'Matched',
                'postalCode': 'Matched',
                'securityCode': 'Matched'

            },
            'paymentMethod': 
            {
                'card': {
                    'merchantSessionKey': 'test-merchant-session-key',
                    'cardIdentifier': 'card-identifier',
                    'reusable': true,
                    'save': true
                }
            },
            'amount': {
                'totalAmount': 567,
                'saleAmount': 897,
                'surchargeAmount': 234
            },
            'currency': 'GBP',
            '3DSecure': 
            {
                'status': 'Authenticated'
            }
        }

        const payment = {
            card: cardInput,
            payment: paymentInput
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

        const base64Creds = Buffer.from('test-user-name:test-password').toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const cardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse)
        const linkCardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse.merchantSessionKey)

        const f = makePayment(opt, cardIdentifierFn, linkCardIdentifierFn)
        const sessionKey = await f(payment)
        
        expect(sessionKey).toEqual(paymentOutput)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions',
            headers,
            body: { ...expectedBody },
            json: true
        }, expect.any(Function))
    })

    test(`
        WHEN default function is called
        AND a merchant session key is provided
        AND a new card identifier is returned
        AND payment type is 3D
        THEN a 3D secure response is returned
    `, async () => {
        const expectedCardIdentierResponse = {
            cardIdentifier: 'test-card-identifier',
            cardType: '12/22',
            merchantSessionKey: 'test-session-key-used'
        }

        const cardInput = {
            cardDetails: {
                cardIdentifier: 'test-card-identifier',
                securityCode: 'test-security-code'
            }
        }

        const paymentInput = {
            transactionType: 'test-transaction-type',
            vendorTxCode: 'test-vendor-tx-code',
            amount: 200.50,
            currency: 'GBP',
            description: 'test-description',
            customerFirstName: 'customer-first-name',
            customerLastName: 'customer-last-name',
            billingAddress: {
                address1: 'test-address-1',
                city: 'test-city',
                postalCode: 'test-postal-code',
                country: 'UK'
            },
            entryMethod: EntryMethod.Ecommerce,
            giftAid: false,
            apply3DSecure: Apply3DSecureOptions.UseMSPSetting,
            applyAvsCvcCheck: 'Force',
            customerEmail: 'aa@aa.com',
            customerPhone: '012789345',
            customerWorkPhone: '012345678',
            referrerId: 'test-referrer-id',
            customerMobilePhone: '012345678'
        }

        const expectedBody = { 
            ...paymentInput,
            paymentMethod: {
                card: {
                    merchantSessionKey: expectedCardIdentierResponse.merchantSessionKey,
                    cardIdentifier: expectedCardIdentierResponse.cardIdentifier,
                    save: true
                }
            } 
        }

        const payment3DSecureOutput = {
            statusCode: 2021,
            statusDetail: 'Please redirect your customer to the ACSURL to complete the 3DS Transaction',
            transactionId: 'DB79BA2D-05DA-5B85-D188-1293D16BBAC7',
            acsUrl: 'https://url-to-be-confirmed/html_challenge',
            cReq: 'eyJtZXNzYWdlVHlwZSI6IkNSZXEiLCJtZXNzYWdlVmVyc2lvbiI6IjIuMS4wIiwidGhyZWVEU1NlcnZlclRyYW5zSUQiOiIwZDUzZjA2Ni1jMDc2LTRkOGItYjcyMi04ZThhOWE0ZWE1NTIiLCJhY3NUcmFuc0lEIjoiMjdiNDlkMTgtMmE4Yi00OGIxLWE4ZTYtNzU3MzlkNmMwNDRiIiwiY2hhbGxlbmdlV2luZG93U2l6ZSI6IjAxIn0',
            status: '3DAuth'
        }

        const payment = {
            card: cardInput,
            payment: paymentInput
        }

        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'http://test-base-url/',
            headers: {},
            httpClient: {
                execute: jest.fn(() => Promise.resolve(payment3DSecureOutput))
            }
        } as any as ConfigOptions

        const base64Creds = Buffer.from('test-user-name:test-password').toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const cardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse)
        const linkCardIdentifierFn = () => Promise.resolve(expectedCardIdentierResponse.merchantSessionKey)

        const f = makePayment(opt, cardIdentifierFn, linkCardIdentifierFn)
        const sessionKey = await f(payment)
        
        expect(sessionKey).toEqual(payment3DSecureOutput)
        expect(opt.httpClient.execute).toHaveBeenCalledWith({
            method: 'POST',
            uri: 'http://test-base-url/api/v1/transactions',
            headers,
            body: { ...expectedBody },
            json: true
        }, expect.any(Function))
    })
})