import prisma from "@/app/utils/db";
import { formatCurrency } from "@/app/utils/formatCurrency";
import jsPDF from "jspdf";
import { NextResponse } from "next/server";
import Logo from '@/public/big5.png'

export const GET = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) => {
  const { invoiceId } = await params;
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      Customer: true,
      date: true,
      dueDate: true,
      total: true,
      note: true,
      status: true,
      invoiceItems: {
        select: {
          Product: {
            select: {
              name: true
            }
          },
          quantity: true,
          rate: true,
          total: true
        }
      }
    },
  });

  if (!data)
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("helvetica");

  // Add Header Section with Logo and Company Info
  const logoUrl = `${new URL(request.url).origin}/big5.png`; // Replace with your logo URL
  const companyName = "BIG FIVE FRESH PRIME MEAT CORPORATION";
  const companyAddress = "Gulod, Cabuyao City Laguna";
  const companyContact = "Phone: +639945848212 | Email: info@big5corp.com";
  console.log(logoUrl)

  // Fetch and Add logo
  try {
    const response = await fetch(logoUrl);
    const buffer = await response.arrayBuffer(); // Get binary data
    const base64Logo = Buffer.from(buffer).toString("base64"); // Convert to Base64
    const logoMimeType = response.headers.get("Content-Type") || "image/png";

    // Add image to the PDF
    pdf.addImage(`data:${logoMimeType};base64,${base64Logo}`, "PNG", 20, 10, 30, 30); // Adjust position and size
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // Add company name and details
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(companyName, 55, 20); // Adjust position for name
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(companyAddress, 55, 25); // Adjust position for address
  pdf.text(companyContact, 55, 30); // Adjust position for contact

  // Draw a line below the header
  pdf.line(20, 42, 190, 42);

  // Add Title
  pdf.setFontSize(36);
  pdf.setFont("helvetica", "bold");
  pdf.text("INVOICE", 139, 55);
  // pdf.setFontSize(10);
  // pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  // Client Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bill to :", 20, 70);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text([data.Customer?.name || '', data.Customer?.email || '', data.Customer?.address || ''], 20, 75);

  // Invoice Details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: #${data.invoiceNumber}`, 150, 75);
  pdf.text(`Date: ${new Intl.DateTimeFormat("en-PH", {
    dateStyle: 'long'
  }).format(data.date)}`, 150, 80);
  pdf.text(`Due Date: Net ${data.dueDate}`, 150, 85);

  // Item table header
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.text("Description", 20, 100)
  pdf.text("Quantity", 100, 100)
  pdf.text("Rate", 130, 100)
  pdf.text("Total", 160, 100)

  // draw a line
  pdf.line(20, 102, 190, 102)

  // Item Details
  let startY = 110; // Start position for the first item
  const pageHeight = 297; // A4 page height in mm
  const marginBottom = 30; // Bottom margin for totals and notes

  pdf.setFont("helvetica", "normal")
  // pdf.text(data.invoiceItemDescription, 20, 110)
  // pdf.text(data.invoiceItemQuantity.toString(), 100, 110)
  // pdf.text(formatCurrency({ amount: data.invoiceItemRate, currency: data.currency as any }), 130, 110)
  // pdf.text(formatCurrency({ amount: data.total, currency: data.currency as any }), 160, 110)
  data.invoiceItems.forEach((item) => {
    // If the Y position exceeds the available space, add a new page
    if (startY > pageHeight - marginBottom) {
      pdf.addPage();
      startY = 20; // Reset startY for the new page
      // Redraw table header on the new page
      pdf.setFont("helvetica", "bold");
      pdf.text("Description", 20, startY);
      pdf.text("Quantity", 100, startY);
      pdf.text("Rate", 130, startY);
      pdf.text("Total", 160, startY);
      pdf.line(20, startY + 2, 190, startY + 2);
      startY += 10; // Move to the next row
    }

    pdf.setFont("helvetica", "normal");
    pdf.text(item.Product.name || "N/A", 20, startY);
    pdf.text(item.quantity.toString(), 105, startY, { align: "right" });
    pdf.text(
      formatCurrency({ amount: item.rate, currency: data.currency as any }),
      145,
      startY,
      { align: "right" }
    );
    pdf.text(
      formatCurrency({ amount: item.total, currency: data.currency as any }),
      190,
      startY,
      { align: "right" }
    );

    startY += 10; // Move to the next row
  });

  // Draw a line between items and Total section
  if (startY > pageHeight - marginBottom) {
    pdf.addPage();
    startY = 20; // Reset startY for the new page
  } else {
    startY += 5; // Add some space before the line
  }
  pdf.line(20, startY, 190, startY); // Divider line
  startY += 10;

  //Total Section
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total :`, 150, startY);
  pdf.text(formatCurrency({ amount: data.total, currency: data.currency as any }), 190, startY, {
    align: "right",
  });

  // Additional Notes
  if (data.note) {
    startY += 15;
    if (startY > pageHeight - marginBottom) {
      pdf.addPage();
      startY = 20;
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Note:`, 20, startY);
    pdf.text(`${data.note}`, 20, startY + 5);
  }

  // generate pdf as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
};
