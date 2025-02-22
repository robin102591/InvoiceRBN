import { InvoiceList } from "@/app/components/InvoiceList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const InvoicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { page, pageSize } = await searchParams;
  const currentPage = isNaN(parseInt(page as string, 10))
    ? 1
    : parseInt(page as string, 10);
  const pageLimit = isNaN(parseInt(pageSize as string, 10))
    ? 10
    : parseInt(pageSize as string, 10);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
            <CardDescription>Manage your invoices right here</CardDescription>
          </div>
          <Button asChild variant="default">
            <Link href="/dashboard/invoices/create">
              <Plus /> Create Invoice
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
          <InvoiceList currentPage={currentPage} pageSize={pageLimit} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default InvoicesPage;
