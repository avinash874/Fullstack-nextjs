import Imagekit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

const imagekit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {

    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        return NextResponse.json(
            { errir: "Imagekit Auth Failed" },
            { status: 500 }
        );
    }
}