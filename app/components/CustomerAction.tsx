"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PencilIcon, Trash } from "lucide-react";
import Link from "next/link";
import React from "react";

export const CustomerAction = ({ customerId }: { customerId: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/customers/${customerId}`}>
            <PencilIcon className="size-4 mr-2" />
            Edit Customer
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/dashboard/customers/${customerId}/delete`}>
            <Trash className="size-4 mr-2 text-red-500" />
            <span className="text-red-500">Delete Customer</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
