"use client";
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
import React, { useActionState, useState } from "react";
import { SubmitButtons } from "./SubmitButtons";
import { createProduct } from "../action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "../utils/zodSchemas";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CreateProduct = () => {
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("kg");
  const [lastResult, action] = useActionState(createProduct, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: productSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Product</CardTitle>
        <CardDescription>Add here your new product</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Product Name</Label>
              <Input
                name={fields?.productName.name}
                key={fields?.productName?.key}
                className="rounded-1-none"
                placeholder="Enter your product name"
              />
              <p className="text-red-500 text-sm">
                {fields.productName.errors}
              </p>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea
                name={fields.productDescription.name}
                key={fields.productDescription.key}
                placeholder="Product description"
              />
            </div>
            <div>
              <Label>Unit Of Measurement</Label>
              <Select
                defaultValue={unitOfMeasurement}
                name={fields.unitOfMeasurement.name}
                key={fields.unitOfMeasurement.key}
                onValueChange={(value) => setUnitOfMeasurement(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit of Measurement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">
                    Kilogram (kg)
                  </SelectItem>
                  <SelectItem value="pcs">Pieces (pcs.)</SelectItem>
                  <SelectItem value="unit">Unit (unit) </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.unitOfMeasurement.errors}</p>
            </div>
            <div>
              <Label>Price</Label>
              <Input
              name={fields?.price?.name}
              key={fields?.price?.key}
                className="rounded-1-none"
                placeholder="0.00"
                type="number"
              />
              <p className="text-red-500 text-sm">
                  {fields.price.errors}
                </p>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButtons text="Save Product" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
