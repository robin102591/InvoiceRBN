"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import { Customer, Prisma } from "@prisma/client";
import { CalendarIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { updateInvoice } from "../action";
import { formatCurrency } from "../utils/formatCurrency";
import { invoiceSchema } from "../utils/zodSchemas";
import { SubmitButtons } from "./SubmitButtons";
import { CustomerCombobox } from "./CustomerCombobox";
import axios from "axios";

interface EditInvoiceProps {
  data: Prisma.InvoiceGetPayload<{}>;
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
  const [rate, setRate] = useState(data.invoiceItemRate.toString());
  const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
  const [currency, setCurrency] = useState(data.currency);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const calculateTotal = (Number(rate) || 0) * (Number(quantity) || 0);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axios.get<Customer[]>("/api/customer");
      setCustomers(response.data);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      const selected = customers.find((c) => c.id === data.customerId);
      setSelectedCustomer(selected ?? null);
      console.log(selected);
    }
  }, [customers, data.customerId]); // Runs whenever customers or customerId changes

  const handleCustomerChange = (customer?: Customer | null) => {
    setSelectedCustomer(customer ?? null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name="id" value={data.id} />
          <input
            type="hidden"
            name={fields.date.name}
            value={selectedDate?.toISOString()}
          />
          <input
            type="hidden"
            name={fields.total.name}
            value={calculateTotal}
          />
          <input
            type="hidden"
            name={fields.customerId.name}
            value={selectedCustomer?.id}
          />
          <div className="flex flex-col gap-1 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields?.invoiceName?.name}
                key={fields?.invoiceName?.key}
                defaultValue={data.invoiceName}
                placeholder="Test 123"
              />
            </div>
            <p className="text-red-500 text-sm">{fields.invoiceName.errors}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
                />

                <Input
                  name="address"
                  defaultValue={selectedCustomer?.address ?? ""}
                  placeholder="Client Address"
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
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={data.invoiceItemDescription}
                  placeholder="Item & description"
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  placeholder="0"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  placeholder="0"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <p className="text-red-500 text-sm">
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  value={formatCurrency({
                    amount: calculateTotal,
                    currency: currency as any,
                  })}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>SubTotal</span>
                <span>
                  {formatCurrency({
                    amount: calculateTotal,
                    currency: currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t ">
                <span>Total ({currency})</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                    amount: calculateTotal,
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
