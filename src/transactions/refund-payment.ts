import { PaymentTransactionOutput } from '../client/payment-transaction'
import { ConfigOptions } from '../client/configOptions'
import { RefundTransactionInput } from '../client/refund-transaction'

export const refundPayment = (opt: ConfigOptions) => 
    async (refundTransactionInput: RefundTransactionInput): Promise<PaymentTransactionOutput> => {
        const method = 'POST'
        const uri = opt.baseUrl + 'api/v1/transactions'

        const body = { 
            ...refundTransactionInput 
        }

        const { username, password } = opt
        const base64Creds = Buffer.from(`${username}:${password}`).toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const params = {
            method,
            uri,
            headers,
            body,
            json: true
        }
        
        return opt.httpClient.execute(params, (response) => ({ ...response }))
    }
