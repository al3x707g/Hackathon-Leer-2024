import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, {params}: {params: {slug: string}}) {

    const {slug} = params

    if(slug) {
        try {
            const words = await prisma.$queryRaw`SELECT word FROM Words WHERE word LIKE ${slug}`

            if(!words) {
                return NextResponse.json({error: 'No data found.'})
            } else {
                return NextResponse.json(words)
            }
        } catch {
            return NextResponse.json({error: 'No data found.'})
        }
    }
}