import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export const POST = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) => {
  try {
    const session = await requireUser();
    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
      select: {
        Customer: true
      }
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Mailtrap Test",
    };

    await emailClient.send({
      from: sender,
      to: [
        {
          email: "robin.nobleza@gmail.com",
        },
      ],
      template_uuid: "ad1242f0-2a0a-4852-ac6e-944c1e0163b3",
      template_variables: {
        first_name: invoiceData.Customer?.name || "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send email reminder" },
      { status: 500 }
    );
  }
};
