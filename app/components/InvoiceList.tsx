import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceAction } from "./InvoiceAction";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { Paginations } from "./Pagination";

const getData = async (
  userId: string,
  currentPage: number,
  pageSize: number
) => {
  const skip = (currentPage - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        clientName: true,
        total: true,
        createdAt: true,
        status: true,
        invoiceNumber: true,
        currency: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    }),
    prisma.invoice.count({
      where: {
        userId: userId,
      },
    }),
  ]);

  return { data, totalCount };
};

export const InvoiceList = async ({
  currentPage,
  pageSize,
}: {
  currentPage: number;
  pageSize: number;
}) => {
  const session = await requireUser();

  const { data: invoices, totalCount } = await getData(
    session.user?.id!,
    currentPage,
    pageSize
  );

  return (
    <>
      {invoices.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Create an invoices to get started"
          buttonText="Create Invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>
                    {formatCurrency({
                      amount: invoice.total,
                      currency: invoice.currency as any,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-white",
                        invoice.status === "PAID"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-black"
                      )}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-PH", {
                      dateStyle: "medium",
                    }).format(invoice.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceAction
                      invoiceId={invoice.id}
                      status={invoice.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginations
            currentPage={currentPage}
            pageLimit={pageSize}
            totalCount={totalCount}
            pathName="/dashboard/invoices"
          />
        </div>
      )}
    </>
  );
};
