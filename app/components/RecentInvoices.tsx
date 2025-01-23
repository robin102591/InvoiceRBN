import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

const getData = async (userId: string) => {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      Customer: true,
      total: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  return data;
};

export const RecentInvoices = async () => {
  const session = await requireUser();
  const data = await getData(session?.user?.id as string);
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>Here are your most recent invoices</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((invoice) => (
          <div key={invoice.id} className="flex items-center gap-5">
            <Avatar className="hidden sm:block size-9">
              <AvatarFallback>
                {invoice.Customer?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">
                {invoice.Customer?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {invoice.Customer?.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +
              {formatCurrency({
                amount: invoice.total,
                currency: invoice.currency as any,
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
