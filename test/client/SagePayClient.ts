import { SagePayClient } from '../../src/client/SagePayClient'
import { ConfigOptions } from '../../src/client/configOptions'
import { Apply3DSecureOptions, EntryMethod } from '../../src/client/payment-transaction'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('SagePayClient', () => {
    test(`
        WHEN createPaymentTransaction is called
        AND transaction details is provided
        THEN a 3D Secure transaction should be created
        AND 3D secure transaction is returned
    `, async () => {
        const opt = {
            username: 'test-user-name', 
            password: 'test-password', 
            vendorName: 'test-vendor-name',
            baseUrl: 'https://pi-test.sagepay.com/',
            httpClient: {
                execute: jest.fn(() => Promise.resolve({}))
            }
        } as any as ConfigOptions
        
        const cardInput = {
            cardDetails: {
                cardNumber: '4462000000000003', // No spaces
                cardholderName: 'test-card holder-name',
                securityCode: '123',
                expiryDate: '0924' // MMYY
            }
        }

        const paymentInput = {
            transactionType: 'payment',
            vendorTxCode: '123456789',
            amount: 100, // TODO: Why should this be an integer?
            currency: 'GBP',
            description: 'test-description',
            customerFirstName: 'customer-first-name',
            customerLastName: 'customer-last-name',
            billingAddress: {
                address1: '28 Denmark Road',
                city: 'South Norwood',
                postalCode: 'SE255QU',
                country: 'GB'
            },
            entryMethod: EntryMethod.Ecommerce,
            giftAid: false,
            apply3DSecure: Apply3DSecureOptions.Force,
            applyAvsCvcCheck: 'Force',
            customerEmail: 'aa@aa.com',
            customerPhone: '012789345',
            customerWorkPhone: '012345678',
            referrerId: 'test-referrer-id',
            customerMobilePhone: '012345678',
            saveCard: true
        }

        const payment = {
            card: cardInput,
            payment: paymentInput
        }

        const client = new SagePayClient(opt)
        const output = await client.createPaymentTransaction(payment)
        expect(output).not.toBeNull()
    })
})