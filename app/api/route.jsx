import { NextResponse } from "next/server"
import { redis } from "@/redis";

export const POST  = async (req) => {
    try {
        const {bus, licenseNo} = await req.json();

        // await redis.set('activedBus', data);
        await redis.hset("actived_Bus", {
            [licenseNo] : {
                ...bus,
                lastUpdated: new Date().toISOString()
            }
        });

        return NextResponse.json({success: true, saved: bus})
    } catch(error){
        return NextResponse.json({error: error.message}, { status: 500 })
    }
}