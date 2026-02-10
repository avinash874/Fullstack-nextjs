import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectionDatabase } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";



export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        // Add your authentication providers here
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validate input
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                // Check user in database
                try {
                    connectionDatabase();
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("No user found with this email");
                    }
                    // Compare password
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                    // if password match then Return user object
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    throw error;
                }

            }
        })
    ],
    // callbacks and other options can be added here
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session, token}){

            if(session.user){
                session.user.id = token.id as string
            }

            return session
        }
    },
    // Custom pages for sign in and error
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
}