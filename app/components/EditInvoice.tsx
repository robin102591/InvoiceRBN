"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Customer, Product } from "@prisma/client";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { updateInvoice } from "../action";
import { formatCurrency } from "../utils/formatCurrency";
import { invoiceSchema } from "../utils/zodSchemas";
import { CustomerCombobox } from "./CustomerCombobox";
import { SubmitButtons } from "./SubmitButtons";

import { InvoiceData, InvoiceItem } from "@/types";
import { EditInvoiceItems } from "./EditInvoiceItems";

interface EditInvoiceProps {
  data: InvoiceData;
}

export const EditInvoice = ({ data }: EditInvoiceProps) => {
  const [lastResult, action] = useActionState(updateInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(data.date);
  const [currency, setCurrency] = useState(data.currency);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    data.invoiceItems.map((i) => {
      return {
        id: i.id,
        productId: i.productId,
        rate: i.rate,
        quantity: i.quantity,
        subTotal: i.total,
      };
    })
  );
  const [deletedInvoiceItems, setDeletedInvoiceItems] = useState<string[]>([]);

  const [total, setTotal] = useState(data.total);
  const [lineItems, setLineItems] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axios.get<Customer[]>("/api/customer");
      setCustomers(response.data);
    };

    const fetchProducts = async () => {
      const response = await axios.get<Product[]>("/api/product");
      setProducts(response.data);
    };

    fetchCustomers();
    fetchProducts();
  }, []);

  // Calculate total and synchronize with Conform
  useEffect(() => {
    const total = invoiceItems.reduce((sum, item) => sum + item.subTotal, 0);
    setTotal(total);
  }, [invoiceItems]);

  useEffect(() => {
    if (customers.length > 0) {
      const selected = customers.find((c) => c.id === data.customerId);
      setSelectedCustomer(selected ?? null);
    }
  }, [customers, data.customerId]); // Runs whenever customers or customerId changes

  const handleCustomerChange = (customer?: Customer | null) => {
    setSelectedCustomer(customer ?? null);
  };

  const handleUpdateItem = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + item.subTotal, 0);
    setTotal(total);
    setInvoiceItems(items);
    setLineItems(JSON.stringify(items));
  };

  const handelInvoiceItemRemoved = (invoiceItem: InvoiceItem) => {
    if (invoiceItem.id) {
      // add to delete invoice item array
      setDeletedInvoiceItems([...deletedInvoiceItems, invoiceItem.id]);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Invoices Form</CardTitle>
            <CardDescription>Edit your invoice here</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name="invoiceId" value={data.id} />
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate?.toISOString()}
          />
          <input type="hidden" name={fields.total.name} value={total} />
          <input
            type="hidden"
            name={fields.customerId.name}
            value={selectedCustomer?.id}
          />
          {/* Hidden Field for Invoice Items */}
          <input
            type="hidden"
            name="invoiceItems"
            value={JSON.stringify(invoiceItems)}
          />
          <input
            type="hidden"
            name="deletedInvoiceItems"
            value={JSON.stringify(deletedInvoiceItems)}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={data.invoiceNumber}
                  className="rounded-l-none"
                  placeholder="5"
                />
              </div>
              <p className="text-red-500 text-sm">
                {fields.invoiceNumber.errors}
              </p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                defaultValue={data.currency}
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar - USD
                  </SelectItem>
                  <SelectItem value="PHP">Philippines Peso - PHP</SelectItem>
                  <SelectItem value="EUR">UK Euro - EUR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.currency.errors}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  defaultValue={data.fromName}
                  placeholder="Your Name"
                />
                <p className="text-red-500 text-sm">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={data.fromEmail}
                  placeholder="Your Email"
                />
                <p className="text-red-500 text-sm">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={data.fromAddress}
                  placeholder="Your Address"
                />
                <p className="text-red-500 text-sm">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>

            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <CustomerCombobox
                  data={customers}
                  onChange={handleCustomerChange}
                  customer={selectedCustomer}
                />
                <p className="text-red-500 text-sm">
                  {fields.customerId.errors}
                </p>
                <Input
                  name="email"
                  defaultValue={selectedCustomer?.email ?? ""}
                  placeholder="Client Email"
                  readOnly
                />

                <Input
                  name="address"
                  defaultValue={selectedCustomer?.address ?? ""}
                  placeholder="Client Address"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div>
                <Label>Date</Label>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[280px] text-left justify-start"
                  >
                    <CalendarIcon />
                    {selectedDate ? (
                      new Intl.DateTimeFormat("en-PH", {
                        dateStyle: "long",
                      }).format(selectedDate)
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    initialFocus
                    fromDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-red-500 text-sm">{fields.date.errors}</p>
            </div>

            <div>
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={data.dueDate.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.dueDate.errors}</p>
            </div>
          </div>
          <div>
            <EditInvoiceItems
              items={invoiceItems}
              onChange={handleUpdateItem}
              onItemRemove={handelInvoiceItemRemoved}
              products={products}
            />
            <p className="text-red-500 text-sm">{fields.total.errors}</p>
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>SubTotal</span>
                <span>
                  {formatCurrency({
                    amount: total,
                    currency: currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t ">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                    amount: total,
                    currency: currency as any,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={data.note ?? undefined}
              placeholder="Add your note/s right here..."
            />
          </div>

          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButtons text="Update Invoice" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
