import { NextResponse } from "next/server"
import { redis } from "@/redis";

export const POST  = async (req) => {
    try {
        const {member, longitude, latitude} = await req.json();

        // await redis.set('activedBus', data);
        await redis.geoadd("actived_Bus_location", {
            member: member,
            longitude: longitude, 
            latitude: latitude
        });

        return NextResponse.json({success: true, saved: bus})
    } catch(error){
        return NextResponse.json({error: error.message}, { status: 500 })
    }
}