import { ConfigOptions } from '../client/configOptions'
import { MerchantSessionKeyOutput } from '../client/merchant-sessionkey'
import { SavedCardIdentifierOutput } from '../client/payment-transaction'

export const linkCardIdentifier = (opt: ConfigOptions, getMerchantSessionKey: () => Promise<MerchantSessionKeyOutput>) => 
    async (savedCardIdentifierOutput: SavedCardIdentifierOutput): Promise<string> => {
        const method = 'POST'
        const uri = opt.baseUrl + `api/v1/card-identifiers/${savedCardIdentifierOutput.cardIdentifier}/security-code`

        const body = { 
            securityCode: savedCardIdentifierOutput.securityCode
        }

        const merchantSessionKeyResult = await getMerchantSessionKey()
        const headers = {
            ...opt.headers,
            Authorization: `Bearer ${merchantSessionKeyResult.merchantSessionKey}`
        }

        const params = {
            method,
            uri,
            headers,
            body,
            json: true
        }
        
        await opt.httpClient.execute(params, (response) => ({ ...response }))

        return merchantSessionKeyResult.merchantSessionKey
    }
