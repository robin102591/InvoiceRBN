
export type InvoiceData = {
    id: string;
    invoiceNumber: string
    date: Date;
    currency: string;
    customerId: string | null;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    dueDate: number
    total: number;
    note: string | null;
    invoiceItems: {
        id: string;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        quantity: number;
        rate: number;
        productId: string;
        invoiceId: string;
    }[];
}

export type InvoiceItem = {
    id?: string;
    temp_id?: string;
    productId: string;
    rate: number;
    quantity: number;
    subTotal: number;
};