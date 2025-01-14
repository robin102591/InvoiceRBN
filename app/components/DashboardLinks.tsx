"use client";
import { cn } from "@/lib/utils";
import { BookUser, HomeIcon, ShoppingBasket, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const dashboardLinks = [
  {
    id: 0,
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: Users2,
  },
  {
    id: 2,
    name: "Products",
    href: "/dashboard/products",
    icon: ShoppingBasket,
  },
  {
    id: 3,
    name: "Customers",
    href: "/dashboard/customers",
    icon: BookUser,
  },
];

export const DashboardLinks = () => {
  const pathname = usePathname();
  return (
    <>
      {dashboardLinks.map((link) => (
        <Link
          href={link.href}
          key={link.id}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
    </>
  );
};
