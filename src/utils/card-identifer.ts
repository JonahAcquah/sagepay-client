import { ConfigOptions } from '../client/configOptions'
import { MerchantSessionKeyOutput } from '../client/merchant-sessionkey'
import { CardIdentifierOutput, CardIdentifierInput } from '../client/card-identifier'

export default (opt: ConfigOptions, getMerchantSessionKey: () => Promise<MerchantSessionKeyOutput>) => 
    async (cardIdentifierInput: CardIdentifierInput): Promise<CardIdentifierOutput> => {
        const method = 'POST'
        const uri = opt.baseUrl + 'api/v1/card-identifiers'
        const body = { ...cardIdentifierInput }

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
        
        return opt.httpClient.execute(params, (response) => ({ ...response, merchantSessionKey: merchantSessionKeyResult.merchantSessionKey }))
    }