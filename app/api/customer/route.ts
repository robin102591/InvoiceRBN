import prisma from "@/app/utils/db"
import { requireUser } from "@/app/utils/hooks"
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const session = await requireUser()
    const data = await prisma.customer.findMany({
        where: {
            userId: session?.user?.id
        }
    });

    return NextResponse.json(data, { status: 200 })
}