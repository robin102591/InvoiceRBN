import { EditProduct } from "@/app/components/EditProduct";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { notFound, redirect } from "next/navigation";

const getData = async (productId: string, userId: string) => {
    const data = await prisma.product.findUnique({
      where: {
        id: productId,
        userId: userId,
      },
    });
  
    return data;
  };

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const productId = (await params).productId;
  const { user } = await requireUser();

  if (!user) redirect("/login");

   const data = await getData(productId, user?.id!);
  
    if (!data) return notFound();

  return <EditProduct data={data}/>
};

export default EditProductPage;
