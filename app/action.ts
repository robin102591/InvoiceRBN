"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { customerSchema, invoiceSchema, onboardingSchema, productSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

export const onBoardUser = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
};

export const createInvoice = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  // Parse invoiceItems from formData
  const rawInvoiceItems = JSON.parse(formData.get("invoiceItems") as string);

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Transform `rawInvoiceItems` to match the `InvoiceItem` Prisma schema
  const invoiceItems = rawInvoiceItems.map((item: any) => ({
    productId: item.productId,
    quantity: item.quantity,
    rate: item.rate,
    total: item.quantity * item.rate, // Calculate total
  }));

  const data = await prisma.invoice.create({
    data: {
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,

      currency: submission.value.currency,
      date: submission.value.date, //string
      dueDate: submission.value.dueDate,

      invoiceNumber: submission.value.invoiceNumber,

      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
      customerId: formData.get('customerId') as string,
      invoiceItems: {
        create: invoiceItems
      }
    },
    select: {
      id: true,
      Customer: true,
      invoiceNumber: true,
      date: true,
      total: true,
      currency: true
    }
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
  };

  await emailClient.send({
    from: sender,
    to: [
      {
        email: "robin.nobleza@gmail.com",
      },
    ],
    template_uuid: "087c5343-7f93-4768-9995-9f5175719432",
    template_variables: {
      clientName: data.Customer?.name ?? "",
      invoiceNumber: data.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-PH", {
        dateStyle: "long",
      }).format(data.date),
      totalAmount: formatCurrency({
        amount: data.total,
        currency: data.currency as any,
      }),
      invoiceLink: `${process.env.BASE_URL}/api/invoice/${data.id}`,
    },
  });

  return redirect("/dashboard/invoices");
};

export const updateInvoice = async (prevState: any, formData: FormData) => {
  const session = await requireUser();
  const invoiceId = formData.get("invoiceId") as string;
  const rawInvoiceItems = JSON.parse(formData.get("invoiceItems") as string);
  const deletedInvoiceItems = JSON.parse(formData.get("deletedInvoiceItems") as string);

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id
    },
    data: {
      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,
      currency: submission.value.currency,
      date: submission.value.date, //string
      dueDate: submission.value.dueDate,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      customerId: formData.get('customerId') as string
    },
    select: {
      id: true,
      Customer: true,
      invoiceNumber: true,
      date: true,
      total: true,
      currency: true
    }
  });

  // Delete removed items
  if (deletedInvoiceItems?.length > 0) {
    await prisma.invoiceItem.deleteMany({
      where: {
        id: { in: deletedInvoiceItems }
      }
    })
  }

  const invoiceItems = rawInvoiceItems.map((item: any) => ({
    id: item?.id ?? "",
    productId: item.productId,
    quantity: item.quantity,
    rate: item.rate,
    total: item.quantity * item.rate, // Calculate total
  }));

  // Upsert invoice items (create or update existing)
  await Promise.all(
    invoiceItems.map((item: any) =>
      prisma.invoiceItem.upsert({
        where: { id: item.id || "" },
        create: {
          productId: item.productId,
          quantity: item.quantity,
          rate: item.rate,
          total: item.total,
          invoiceId,
        },
        update: {
          productId: item.productId,
          quantity: item.quantity,
          rate: item.rate,
          total: item.total,
        },
      })
    )
  );

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Mailtrap Test",
  };

  await emailClient.send({
    from: sender,
    to: [
      {
        email: "robin.nobleza@gmail.com",
      },
    ],
    template_uuid: "a42bbc9f-1604-4231-bd76-b3fca1f9c813",
    template_variables: {
      clientName: data.Customer?.name ?? "",
      invoiceNumber: data.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-PH", {
        dateStyle: "long",
      }).format(data.date),
      totalAmount: formatCurrency({
        amount: data.total,
        currency: data.currency as any,
      }),
      invoiceLink: `${process.env.BASE_URL}/api/invoice/${data.id}`,
    },
  });

  return redirect("/dashboard/invoices");

}

export const deleteInvoice = async (invoiceId: string) => {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id
    },
  });

  return redirect("/dashboard/invoices");
}

export const markAsPaid = async (invoiceId: string) => {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id
    },
    data: {
      status: "PAID"
    }
  });

  return redirect("/dashboard/invoices");
}

export const createProduct = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.product.create({
    data: {
      name: submission.value.productName,
      description: submission.value.productDescription,
      price: submission.value.price,
      userId: session.user?.id,
      unitOfMeasurement: submission.value.unitOfMeasurement
    }
  });

  return redirect('/dashboard/products')
}

export const updateProduct = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.product.update({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id
    },
    data: {
      name: submission.value.productName,
      description: submission.value.productDescription,
      price: submission.value.price,
      userId: session.user?.id,
      unitOfMeasurement: submission.value.unitOfMeasurement
    }
  });

  return redirect('/dashboard/products')
}

export const deleteProduct = async (productId: string) => {
  const session = await requireUser();

  const data = await prisma.product.delete({
    where: {
      id: productId,
      userId: session.user?.id
    }
  });

  return redirect("/dashboard/products");
}

export const createCustomer = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: customerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.customer.create({
    data: {
      name: submission.value.customerName,
      email: submission.value.email,
      address: submission.value.address ?? "",
      phone: submission.value.phone,
      userId: session.user?.id
    }
  });

  return redirect('/dashboard/customers')
}

export const updateCustomer = async (prevState: any, formData: FormData) => {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: customerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.customer.update({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id
    },
    data: {
      name: submission.value.customerName,
      email: submission.value.email,
      address: submission.value.address ?? "",
      phone: submission.value.phone
    }
  });

  return redirect('/dashboard/customers')
}

export const deleteCustomer = async (customerId: string) => {
  const session = await requireUser();

  const data = await prisma.customer.delete({
    where: {
      id: customerId,
      userId: session.user?.id
    }
  });

  return redirect("/dashboard/customers");
}