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
import { Prisma } from "@prisma/client";
import { useActionState, useState } from "react";
import { updateProduct } from "../action";
import { productSchema } from "../utils/zodSchemas";
import { SubmitButtons } from "./SubmitButtons";

interface EditProductProps {
  data: Prisma.ProductGetPayload<{}>;
}

export const EditProduct = ({ data }: EditProductProps) => {
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(
    data?.unitOfMeasurement ?? "kg"
  );
  const [lastResult, action] = useActionState(updateProduct, undefined);
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
        <CardTitle className="text-2xl font-bold">Update Product</CardTitle>
        <CardDescription>Manage existing product</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
          <input type="hidden" name="id" value={data.id} />
          <div className="flex flex-col gap-3">
            <div>
              <Label>Product Name</Label>
              <Input
                name={fields?.productName.name}
                key={fields?.productName?.key}
                defaultValue={data.name}
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
                defaultValue={data.description ?? undefined}
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
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="pcs">Pieces (pcs.)</SelectItem>
                  <SelectItem value="unit">Unit (unit) </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">
                {fields.unitOfMeasurement.errors}
              </p>
            </div>
            <div>
              <Label>Price</Label>
              <Input
                name={fields?.price?.name}
                key={fields?.price?.key}
                defaultValue={data.price}
                className="rounded-1-none"
                placeholder="0.00"
                type="number"
              />
              <p className="text-red-500 text-sm">{fields.price.errors}</p>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButtons text="Update Product" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
