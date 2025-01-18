import { deleteCustomer } from "@/app/action";
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
import WarningGif from "@/public/warning.gif";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const authorize = async (customerId: string, userId: string) => {
  const data = await prisma.customer.findUnique({
    where: {
      id: customerId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/customers");
  }

  return data;
};

const DeleteCustomerPage = async ({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) => {
  const session = await requireUser();
  const customerId = (await params).customerId;
  const data = await authorize(customerId, session.user?.id as string);
  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle>Delete Product</CardTitle>
          <CardDescription>
            Are you sure that you want to delete this customer{" "}
            <span className="font-bold">{data.name}</span>?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={WarningGif} alt="Warning" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/customers"
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteCustomer(customerId);
            }}
          >
            <SubmitButtons text="Delete Customer" variant={"destructive"} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteCustomerPage;
