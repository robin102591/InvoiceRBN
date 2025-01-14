import { deleteProduct } from "@/app/action";
import { SubmitButtons } from "@/app/components/SubmitButtons";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import WarningGif from '@/public/warning.gif';
import Image from 'next/image';
import Link from "next/link";
import { redirect } from "next/navigation";

const authorize = async (productId: string, userId: string) => {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect("/dashboard/products");
  }

  return data;
};

const DeleteProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const session = await requireUser();
  const productId = (await params).productId;

  const data = await authorize(productId, session.user?.id as string);
  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle>Delete Product</CardTitle>
          <CardDescription>
            Are you sure that you want to delete this product{" "}
            <span className="font-bold">{data.name}</span>?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={WarningGif} alt="Warning" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/products"
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteProduct(productId);
            }}
          >
            <SubmitButtons text="Delete Invoice" variant={"destructive"} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteProductPage;
