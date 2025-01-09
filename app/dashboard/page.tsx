import { Suspense } from "react";
import { DashboardBlock } from "../components/DashboardBlock";
import { EmptyState } from "../components/EmptyState";
import { InvoiceGraph } from "../components/InvoiceGraph";
import { RecentInvoices } from "../components/RecentInvoices";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const getData = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  return data;
};

const Dashboard = async () => {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Create an invoice to see it right here"
          buttonText="Create Invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <>
          <Suspense fallback={<Skeleton className="w-full h-full flex-1"/>}>
            <DashboardBlock />
            <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
              <InvoiceGraph />
              <RecentInvoices />
            </div>
          </Suspense>
        </>
      )}
    </>
  );
};

export default Dashboard;
