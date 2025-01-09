import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Graph } from "./Graph";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";

const getInvoiceData = async (userId: string) => {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        //gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //Group and aggregate data
  const aggregatedData = rawData.reduce(
    (acc: { [key: string]: number }, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      });

      acc[date] = (acc[date] || 0) + curr.total;

      return acc;
    },
    {}
  );

  // Convert to array and from the object
  const transformData = Object.entries(aggregatedData)
    .map(([date, amount]) => {
      return {
        date,
        amount,
        originalDate: new Date(date + ", " + new Date().getFullYear()),
      };
    })
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime()).map(({date, amount}) => {
      return {
        date,
        amount
      };
    });

  return transformData;
};

export const InvoiceGraph = async () => {
  const session = await requireUser();
  const data = await getInvoiceData(session?.user?.id as string);
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Invoice Graph</CardTitle>
        <CardDescription>
          Invoices which have been paid in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
};
