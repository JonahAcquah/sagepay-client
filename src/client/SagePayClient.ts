import { ConfigOptions, SagePayOptions } from './configOptions'
import merchantSessionKey from '../utils/merchant-session-key'
import cardIdentifier from '../utils/card-identifer'
import { makePayment } from '../transactions/make-payment'
import { refundPayment } from '../transactions/refund-payment'
import { completePayment } from '../transactions/complete-payment-transaction'
import { ThreeDSecureOutput } from './three-d-secure-output'
import { 
    PaymentTransactionOutput, 
    PaymentTransactionInput, 
    CompletePaymentTransactionInput as CompleteTransactionInput, SavedCardIdentifierOutput 
} from './payment-transaction'
import { HttpClient } from '../utils/http-client'
import { MerchantSessionKeyOutput } from './merchant-sessionkey'
import { CardIdentifierInput, CardIdentifierOutput } from './card-identifier'
import { RefundTransactionInput } from './refund-transaction'
import { linkCardIdentifier } from '../transactions/link-card-identifier'

export class SagePayClient {

    private readonly createMerchantSessionKey: () => Promise<MerchantSessionKeyOutput>
    private readonly createCardIdentifier: (cardIdentifierInput: CardIdentifierInput) => Promise<CardIdentifierOutput>
    private readonly createLinkCardIdentifier: (savedCardIdentifierOutput: SavedCardIdentifierOutput) => Promise<string>

    public createPaymentTransaction: (paymentTransactionInput: PaymentTransactionInput) => Promise<PaymentTransactionOutput | ThreeDSecureOutput> 
    public completePaymentTransaction: (completeTransactionInput: CompleteTransactionInput) => Promise<PaymentTransactionOutput>
    public createRefundTransaction: (refundTransactionInput: RefundTransactionInput) => Promise<PaymentTransactionOutput>

    constructor ( 
        private options: SagePayOptions) {

        const opt = {
            ...this.options,
            httpClient: this.options.httpClient || new HttpClient(this.options.logger),
            headers: this.options.headers || {
                'content-type': 'application/json'
            }
        } as ConfigOptions

        this.createMerchantSessionKey = merchantSessionKey(opt)
        this.createCardIdentifier = cardIdentifier(opt, this.createMerchantSessionKey)
        this.createLinkCardIdentifier = linkCardIdentifier(opt, this.createMerchantSessionKey)
        this.createPaymentTransaction = makePayment(opt, this.createCardIdentifier, this.createLinkCardIdentifier)
        this.completePaymentTransaction = completePayment(opt)
        this.createRefundTransaction = refundPayment(opt)
    }
}