import { CardIdentifierInput } from './card-identifier'

export enum Apply3DSecureOptions {
    UseMSPSetting = 'UseMSPSetting',
    Force = 'Force',
    Disable = 'Disable',
    ForceIgnoringRules = 'ForceIgnoringRules'
}

export type AvsCvsCheck = {
    status: string;
    address: string;
    postalCode: string;
    securityCode: string;
}

export type SavedCardIdentifierOutput = {
    merchantSessionKey: string;
    cardIdentifier: string;
    reusable: boolean;
    save: boolean;
}

export type TransactionAmount = {
    totalAmount: number;
    saleAmount: number;
    surchargeAmount: number;
}

export type PaymentMethod = {
    card: SavedCardIdentifierOutput;
}

export type ThreeDSecure = {
    status: string;
}

export type PaymentTransactionOutput = {

    transactionId: string;
    transactionType: string;
    status: string;
    statusCode: number;
    statusDetail: string;
    retrievalReference: string;
    bankResponseCode: string;
    bankAuthorisationCode: string;
    amount: TransactionAmount;
    avsCvsCheck: AvsCvsCheck;
    currency: string;
    paymentMethod: PaymentMethod;
    '3DSecure': ThreeDSecure;
}

export type CardDetailsInput = {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
}

export type ShippingDetails = {
    recipientFirstName: string;
    recipientLastName: string;
    shippingAddress1: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
}

export enum EntryMethod {
    Ecommerce = 'Ecommerce',
    MailOrder = 'MailOrder',
    TelephoneOrder = 'TelephoneOrder'
}

export type PaymentDetailsInput = {
    transactionType: string;
    vendorTxCode: string;
    amount: number;
    currency: string;
    description: string;
    customerFirstName: string;
    customerLastName: string;
    billingAddress: BillingAddress;
    entryMethod?: EntryMethod;
    giftAid?: boolean;
    apply3DSecure?: Apply3DSecureOptions;
    applyAvsCvcCheck?: string;
    customerEmail?: string;
    customerPhone?: string;
    shippingDetails?: ShippingDetails;
    referrerId?: string;
    customerMobilePhone?: string;
    customerWorkPhone?: string;
}

export type BillingAddress = {
    address1: string;
    city: string;
    postalCode: string;
    country: string;
    state?: string;
}

export type PaymentTransactionInput = {
    payment: PaymentDetailsInput;
    card: CardIdentifierInput;
}

export type CompletePaymentTransactionOutput = {
    status: string;
}

export type CompletePaymentTransactionInput = {
    transactionid: string;
    paRes: string;
}