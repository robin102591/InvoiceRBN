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
import { CustomerAction } from "./CustomerAction";

const getData = async (
  userId: string,
  currentPage: number,
  pageSize: number
) => {
  const skip = (currentPage - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    await prisma.customer.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.customer.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  return { data, totalCount };
};

export const CustomerList = async ({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) => {
  const session = await requireUser();
  if (!session) {
  }
  const { data: customers, totalCount } = await getData(
    session.user?.id!,
    currentPage,
    pageSize
  );
  return (
    <>
      {customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Create customer to get started"
          buttonText="Create Customer"
          href="/dashboard/customers/create"
        />
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell className="text-right">
                    <CustomerAction customerId={customer.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginations
            currentPage={currentPage}
            pageLimit={pageSize}
            totalCount={totalCount}
            pathName="/dashboard/customers"
          />
        </div>
      )}
    </>
  );
};
