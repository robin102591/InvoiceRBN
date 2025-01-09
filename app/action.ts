"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
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

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,

      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,

      currency: submission.value.currency,
      date: submission.value.date, //string
      dueDate: submission.value.dueDate,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,

      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,

      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
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
      clientName: data.clientName,
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

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.update({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id
    },
    data: {
      clientName: submission.value.clientName,
      clientEmail: submission.value.clientEmail,
      clientAddress: submission.value.clientAddress,

      fromName: submission.value.fromName,
      fromEmail: submission.value.fromEmail,
      fromAddress: submission.value.fromAddress,

      currency: submission.value.currency,
      date: submission.value.date, //string
      dueDate: submission.value.dueDate,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,

      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,

      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
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
    template_uuid: "a42bbc9f-1604-4231-bd76-b3fca1f9c813",
    template_variables: {
      clientName: data.clientName,
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
    }
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
