import { EditCustomer } from "@/app/components/EditCustomer";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound, redirect } from "next/navigation";
import React from "react";

const getData = async (customerId: string, userId: string) => {
  const data = await prisma.customer.findUnique({
    where: {
      id: customerId,
      userId: userId,
    },
  });

  return data;
};
const EditCustomerPage = async ({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) => {
  const customerId = (await params).customerId;
  const { user } = await requireUser();

  if (!user) redirect("/login");

  const data = await getData(customerId, user?.id!);

  if (!data) return notFound();

  return <EditCustomer data={data} />;
};

export default EditCustomerPage;
