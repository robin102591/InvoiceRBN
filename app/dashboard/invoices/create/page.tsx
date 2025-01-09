import { CreateInvoice } from "@/app/components/CreateInvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import React from "react";

const getUserData = async () => {
  const session = await requireUser();
  const data = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });

  return data;
};

const CreateInvoicePage = async () => {
  const user = await getUserData();
  return (
    <CreateInvoice
      userFirstName={user?.firstName as string}
      userLastName={user?.lastName as string}
      userAddress={user?.address as string}
      userEmail={user?.email as string}
    />
  );
};

export default CreateInvoicePage;
