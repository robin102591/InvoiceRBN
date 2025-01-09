"use client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import React from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const mockData = [
  { date: "January 1", amount: 4000 },
  { date: "January 2", amount: 3000 },
  { date: "January 3", amount: 2000 },
  { date: "January 4", amount: 2780 },
  { date: "January 5", amount: 1890 },
  { date: "January 6", amount: 2390 },
  { date: "January 7", amount: 3490 },
];

interface GraphProps {
  data: {date: string, amount: number}[]
}

export const Graph = ({data}: GraphProps) => {
  return (
    <ChartContainer
      config={{
        amount: {
          label: "Amount",
          color: "hsl(var(--primary))",
        },
      }}
      className="min-h-[300px]"
    >
        <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
                <XAxis dataKey='date' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent indicator="line"/>}/>
                <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={2}/>
            </LineChart>
        </ResponsiveContainer>
    </ChartContainer>
  );
};
