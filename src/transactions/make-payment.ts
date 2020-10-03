import { CardIdentifierOutput, CardIdentifierInput, CardDetails } from '../client/card-identifier'
import { PaymentTransactionOutput, PaymentTransactionInput, SavedCardIdentifierOutput } from '../client/payment-transaction'
import { ThreeDSecureOutput } from '../client/three-d-secure-output'
import { ConfigOptions } from '../client/configOptions'

export const makePayment = (
    opt: ConfigOptions, 
    getCardIdentifier: (cardIdentifierInput: CardIdentifierInput) => Promise<CardIdentifierOutput>,
    linkCardIdentifier: (savedCardIdentifierOutput: SavedCardIdentifierOutput) => Promise<string>
) => 
    async (paymentTransactionInput: PaymentTransactionInput): Promise<PaymentTransactionOutput | ThreeDSecureOutput> => {
        const method = 'POST'
        const uri = opt.baseUrl + 'api/v1/transactions'

        let card
        const cardDetails = paymentTransactionInput.card.cardDetails as SavedCardIdentifierOutput
        if(cardDetails?.cardIdentifier) {
            // Reusing cardidentifier
            const merchantSessionKey = await linkCardIdentifier(cardDetails)
            card = {
                merchantSessionKey,
                cardIdentifier: cardDetails.cardIdentifier,
                save: true
            }
        } else {
            // Generate and use new cardidentifier
            const cardIdentifierResponse = await getCardIdentifier(paymentTransactionInput.card)
            const cardDetails = (paymentTransactionInput.card.cardDetails as CardDetails)
            card = {
                merchantSessionKey: cardIdentifierResponse.merchantSessionKey,
                cardIdentifier: cardIdentifierResponse.cardIdentifier,
                save: cardDetails.saveCard
            }
        }

        const body = { 
            ...paymentTransactionInput.payment,
            paymentMethod: {
                card
            } 
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
