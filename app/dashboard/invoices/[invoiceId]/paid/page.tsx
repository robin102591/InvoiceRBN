import { markAsPaid } from "@/app/action";
import { SubmitButtons } from "@/app/components/SubmitButtons";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaidGif from "@/public/paid.gif";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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

const MarkAsPaidPage = async ({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) => {
  const session = await requireUser();
  const invoiceId = (await params).invoiceId;
  await authorize(invoiceId, session.user?.id as string);
  
  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle>Mark as Paid?</CardTitle>
          <CardDescription>
            Are you sure you want to mark this invoice as paid?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={PaidGif} alt="Paid" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await markAsPaid(invoiceId);
            }}
          >
            <SubmitButtons text="Mark as Paid!" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkAsPaidPage;
