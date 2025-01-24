import { z } from 'zod'
export const onboardingSchema = z.object({
    firstName: z.string().min(2, "First  name is required."),
    lastName: z.string().min(2, "Lastname is required."),
    address: z.string().min(2, "Address is required")
})

export const invoiceSchema = z.object({
    total: z.number().min(1, "At least one item is required in the invoice"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.number().min(0, "Due Date is required"),

    fromName: z.string().min(1, "Your Name is required"),
    fromEmail: z.string().email("Invalid Email address"),
    fromAddress: z.string().min(1, "Your Address is required"),

    currency: z.string().min(1, "Currency is required"),
    invoiceNumber: z.string().min(1, "Minimum invoice number of 1"),

    note: z.string().optional(),

    customerId: z.string().min(1, "Customer is required")
})

export const productSchema = z.object({
    productName: z.string().min(2, "Product Name is required."),
    productDescription: z.string().optional(),
    price: z.number().min(1, "Price is required"),
    unitOfMeasurement: z.string().min(1, "Unit of Measurement required.")
});

export const customerSchema = z.object({
    customerName: z.string().min(2, "Customer Name is required."),
    email: z.string().email("Invalid email"),
    address: z.string().optional(),
    phone: z.string()
})
