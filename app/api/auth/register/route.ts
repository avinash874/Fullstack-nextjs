import { NextRequest,NextResponse } from "next/server";
import { connectionDatabase } from "@/lib/db";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
        return NextResponse.json(
            {error: "Email and password are required"},
            {status: 400}
        )
    }
    await connectionDatabase();

    const existingUser = await User.findOne({email})
    if(existingUser){
        return NextResponse.json(
            {error: "User already exists"},
            {status: 400}
        );
    }

    await User.create({
        email,
        password
    })
    return NextResponse.json(
        {error: "User register successfully"},
        {status: 201}
    )


    } catch (error) {
        return NextResponse.json(
        {error: "Failed to register User"},
        {status: 500}
    )   
}
}