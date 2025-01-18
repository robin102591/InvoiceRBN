"use client";
import React, { useActionState } from "react";
import { createCustomer } from "../action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { customerSchema } from "../utils/zodSchemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButtons } from "./SubmitButtons";

export const CreateCustomer = () => {
  const [lastResult, action] = useActionState(createCustomer, undefined);
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
        <CardTitle className="text-2xl font-bold">Create Customer</CardTitle>
        <CardDescription>Add here your new customer</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Customer Name</Label>
              <Input
                name={fields.customerName.name}
                key={fields.customerName.key}
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
                placeholder="Customer description"
              />
              <p className="text-red-500 text-sm">{fields.address.errors}</p>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButtons text="Save Customer" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
