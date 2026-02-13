import { authOptions } from "@/lib/auth";
import { connectionDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        await connectionDatabase();
        const videos = await Video.find({}).sort({createdAt: -1}).lean();
        if(!videos || videos.length === 0){
            return NextResponse.json([], {status: 200})
        }
        return NextResponse.json(videos, {status: 200})
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetched videos"},
            {status: 500}
        ) 
        console.error(error);
    }
}

// This route will handle video uploads and will be protected, only authenticated users can upload videos
export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }
        await connectionDatabase();
        const body:IVideo = await request.json()
        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missing request field"},
                {status: 400}
            );
        }
// Create new video document in database
     const videoData = {
        ...body,
        constrols: body.controls ?? true,
        transformation:{
            height: 1920,
            width: 1080,
            quality: body.transformation?.quality ?? 100
        }
     }
     // Save video to database
     const newVideo = await Video.create(videoData)
     return NextResponse.json(newVideo)
    } catch (error) {
        return NextResponse.json(
            {error: "failed to create a video"},
            {status: 500}
        )
    }

}