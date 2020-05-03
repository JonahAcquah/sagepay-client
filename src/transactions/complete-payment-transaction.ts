import { PaymentTransactionOutput, CompletePaymentTransactionInput, CompletePaymentTransactionOutput } from '../client/payment-transaction'
import { ConfigOptions } from '../client/configOptions'

export const completePayment = (opt: ConfigOptions) => 
    async (completePaymentTransactionInput: CompletePaymentTransactionInput): Promise<PaymentTransactionOutput> => {

        const { username, password } = opt
        const base64Creds = Buffer.from(`${username}:${password}`).toString('base64')
        const headers = {
            ...opt.headers,
            Authorization: `Basic ${base64Creds}`
        }

        const verify3DSecureTransaction = async (): Promise<CompletePaymentTransactionOutput> => {
            const method = 'POST'
            const uri = opt.baseUrl + `api/v1/transactions/${completePaymentTransactionInput.transactionid}/3d-secure`

            const body = { 
                paRes: completePaymentTransactionInput.paRes 
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

        const verify3DSecureTransactionResponse = await verify3DSecureTransaction()
        if(verify3DSecureTransactionResponse.status === 'Authenticated' ||
           verify3DSecureTransactionResponse.status === 'Ok Transaction') {
            const method = 'GET'
            const uri = opt.baseUrl + `api/v1/transactions/${completePaymentTransactionInput.transactionid}`

            const params = {
                method,
                uri,
                headers
            }
            
            return opt.httpClient.execute(params, (response) => ({ ...response }))
        }

        throw new Error(verify3DSecureTransactionResponse.status)
    }
