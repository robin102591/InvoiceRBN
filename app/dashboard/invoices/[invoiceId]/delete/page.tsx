import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import React from "react";
import Image from 'next/image'
import WarningGif from '@/public/warning.gif'
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButtons } from "@/app/components/SubmitButtons";
import { deleteInvoice } from "@/app/action";

const authorize = async (invoiceId: string, userId: string) => {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }

  return data;
};

const DeleteInvoicePage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const session = await requireUser();
  const invoiceId = (await params).invoiceId;

  const data = await authorize(invoiceId, session.user?.id as string);

  return <div className="flex flex-1 justify-center items-center">
    <Card className="max-w-[500px]">
        <CardHeader>
            <CardTitle>Delete Invoice</CardTitle>
            <CardDescription>Are you sure that you want to delete this invoice <span className="font-bold">{data.invoiceNumber}</span>?</CardDescription>
        </CardHeader>
        <CardContent>
            <Image src={WarningGif} alt="Warning" className="rounded-lg"/>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link href="/dashboard/invoices" className={buttonVariants({variant: 'secondary'})}>Cancel</Link>
          <form action={ async () => {
            "use server"
            await deleteInvoice(invoiceId);
          }}>
            <SubmitButtons text="Delete Invoice" variant={"destructive"}/>
          </form>
        </CardFooter>
    </Card>
  </div>;
};

export default DeleteInvoicePage;
