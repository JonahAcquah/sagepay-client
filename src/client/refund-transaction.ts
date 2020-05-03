export type RefundTransactionInput = {
    referenceTransactionId: string;
    transactionType: string;
    vendorTxCode: string;
    description: string;
    amount: number;
}