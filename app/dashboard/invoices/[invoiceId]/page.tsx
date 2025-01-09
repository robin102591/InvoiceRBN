import { EditInvoice } from "@/app/components/EditInvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound, redirect } from "next/navigation";
import React from "react";

const getData = async (invoiceId: string, userId: string) => {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  return data;
};

const EditInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const invoiceId = (await params).invoiceId;
  const { user } = await requireUser();

  if (!user) redirect("/login");

  const data = await getData(invoiceId, user?.id!);

  if (!data) return notFound();

  return <EditInvoice data={data} />;
};

export default EditInvoicePage;
