import prisma from "../../lib/db";

export const dynamic = 'force-dynamic'

export default async function handler(request, result) {
    if(request.method === 'GET') {
        try {
            const words = await prisma.words.findMany()
            if(!words || words.length === 0)
                result.status(400).json({error: 'No data found.'});
            else
                result.status(200).json(words)

        } catch {
            result.status(404).json({error: 'Could not fetch words.'});
        }
    }
    if(request.method === 'POST') {
        try {
            let data = JSON.parse(request.body)
            if(data) {
                await prisma.words.create({
                    data: {
                        word: data.word
                    }
                })
                result.status(201).json({success: 'Word successfully created.'});

            } else result.status(404).json({error: 'Invalid POST request.'});
        }  catch {
            result.status(400).json({error: 'Could not create word.'});
        }
    }
}