import { SavedCardIdentifierOutput } from './payment-transaction'

export type CardIdentifierOutput = {
    cardIdentifier: string;
    cardType: string;
    merchantSessionKey: string;
}

export type CardDetails = {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    saveCard?: boolean;
}

export type CardIdentifierInput = {
    cardDetails: CardDetails | SavedCardIdentifierOutput;
}