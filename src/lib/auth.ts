import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import {checkout , polar , portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";


export const auth = betterAuth({
    database: prismaAdapter(prisma,{
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },

    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products:[
                        {
                            productId: "c8e0b626-12dd-41d5-b4ba-c3f434deab67",
                            slug: "pro",
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ]
        })
    ]


});