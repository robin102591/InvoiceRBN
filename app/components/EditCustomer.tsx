"use client";
import { updateCustomer } from "@/app/action";
import { SubmitButtons } from "@/app/components/SubmitButtons";
import { customerSchema } from "@/app/utils/zodSchemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";
import { useActionState } from "react";

interface EditCustomerProps {
  data: Prisma.CustomerGetPayload<{}>;
}

export const EditCustomer = ({ data }: EditCustomerProps) => {
  const [lastResult, action] = useActionState(updateCustomer, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: customerSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Customer</CardTitle>
        <CardDescription>Manage existing customer</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name="id" value={data.id} />
          <div className="flex flex-col gap-3">
            <div>
              <Label>Customer Name</Label>
              <Input
                name={fields.customerName.name}
                key={fields.customerName.key}
                defaultValue={data.name}
                className="rounded-1-none"
                placeholder="Enter your customer name"
              />
              <p className="text-red-500 text-sm">
                {fields.customerName.errors}
              </p>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name={fields.email.name}
                key={fields.email.key}
                defaultValue={data.email}
                className="rounded-1-none"
                placeholder="Enter your customer email"
              />
              <p className="text-red-500 text-sm">{fields.email.errors}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                name={fields.phone.name}
                key={fields.phone.key}
                defaultValue={data.phone ?? ""}
                className="rounded-1-none"
                placeholder="Enter your customer phone number"
              />
              <p className="text-red-500 text-sm">{fields.phone.errors}</p>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                name={fields.address.name}
                key={fields.address.key}
                defaultValue={data.address}
                placeholder="Customer description"
              />
              <p className="text-red-500 text-sm">{fields.address.errors}</p>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButtons text="Update Customer" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
