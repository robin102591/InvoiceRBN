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
import { cn } from "@/lib/utils";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface CustomerComboboxProps {
  onChange: (customer: Customer | null) => void;
  data: Customer[];
  customer?: Customer | null;
}

export const CustomerCombobox = ({
  data,
  onChange,
  customer,
}: CustomerComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    customer ?? null
  );

  // Update selectedCustomer state whenever the customer prop changes
  useEffect(() => {
    setSelectedCustomer(customer ?? null);
  }, [customer]);

  const handleSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    setOpen(false);
    onChange(customer);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCustomer ? selectedCustomer.name : "Select Customer"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select Customer" />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {data.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={() => handleSelect(customer)}
                >
                  {customer.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedCustomer?.id === customer.id
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
  );
};
