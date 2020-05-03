import { ConfigOptions } from '../client/configOptions'
import { MerchantSessionKeyOutput } from '../client/merchant-sessionkey'

export default (opt: ConfigOptions) => 
    async (): Promise<MerchantSessionKeyOutput> => {
        const method = 'POST'
        const uri = opt.baseUrl + 'api/v1/merchant-session-keys'
        const { username, password, vendorName } = opt
        const body = { vendorName }
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