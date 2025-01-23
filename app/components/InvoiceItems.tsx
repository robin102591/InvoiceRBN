"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "../utils/formatCurrency";
import { InvoiceItem } from "@/types";

interface InvoiceItemsProps {
  onChange: (item: InvoiceItem[]) => void;
  items: InvoiceItem[];
  products: Product[];
}

export const InvoiceItems = ({
  onChange,
  items,
  products,
}: InvoiceItemsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Track which row's dropdown is open

  const handleAddItem = () => {
    const invoiceItem = {
      temp_id: crypto.randomUUID(),
      productId: "",
      rate: 0,
      quantity: 1,
      subTotal: 0,
    };
    onChange([...items, invoiceItem]);
  };

  const handleUpdateItem = (idx: number, updatedItem: InvoiceItem) => {
    onChange(
      items.map((item, i) => (i === idx ? { ...item, ...updatedItem } : item))
    );
  };

  const handleRemoveItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  {/* Product Selection */}
                  <Popover
                    open={openIndex === index}
                    onOpenChange={(isOpen) =>
                      setOpenIndex(isOpen ? index : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openIndex === index}
                        className="w-full justify-between"
                      >
                        {item.productId
                          ? products.find((p) => p.id === item.productId)?.name
                          : "Select Product"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search Product" required />
                        <CommandList>
                          <CommandEmpty>No product found.</CommandEmpty>
                          <CommandGroup>
                            {products.map((product) => (
                              <CommandItem
                                key={product.id}
                                value={product.id}
                                onSelect={() => {
                                  if (product.id !== item.productId) {
                                    handleUpdateItem(index, {
                                      ...item,
                                      productId: product.id,
                                      rate: product.price,
                                      quantity: 1,
                                      subTotal: product.price * 1,
                                    });
                                  }
                                  setOpenIndex(null);
                                }}
                              >
                                {product.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.productId === product.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleUpdateItem(index, {
                        ...item,
                        rate: parseFloat(e.target.value) || 0,
                        subTotal:
                          (parseFloat(e.target.value) || 0) * item.quantity,
                      })
                    }
                    placeholder="Price"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(index, {
                        ...item,
                        quantity: parseFloat(e.target.value) || 0,
                        subTotal: (parseFloat(e.target.value) || 0) * item.rate,
                      })
                    }
                    placeholder="Price"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={formatCurrency({
                      amount: item.subTotal,
                      currency: "PHP",
                    })}
                    readOnly
                    className="text-right"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div>
        <Button type="button" onClick={handleAddItem} className="w-full">
          <Plus /> Add Item
        </Button>
      </div>
    </>
  );
};
