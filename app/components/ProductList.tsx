import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";
import { ProductAction } from "./ProductAction";
import { Paginations } from "./Pagination";
import { EmptyState } from "./EmptyState";

const getData = async (
  userId: string,
  currentPage: number,
  pageSize: number
) => {
  const skip = (currentPage - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    await prisma.product.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        unitOfMeasurement: true,
        price: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.product.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  return { data, totalCount };
};

export const ProductList = async ({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) => {
  const session = await requireUser();
  if (!session) {
  }
  const { data: products, totalCount } = await getData(
    session.user?.id!,
    currentPage,
    pageSize
  );
  return (
    <>
      {products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Create products to get started"
          buttonText="Create Product"
          href="/dashboard/products/create"
        />
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">
                  Unit Of Measurement
                </TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell className="text-center">
                    {product.unitOfMeasurement}
                  </TableCell>
                  <TableCell>
                    {formatCurrency({
                      amount: product.price,
                      currency: "PHP",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ProductAction productId={product.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginations
            currentPage={currentPage}
            pageLimit={pageSize}
            totalCount={totalCount}
            pathName="/dashboard/products"
          />
        </div>
      )}
    </>
  );
};
