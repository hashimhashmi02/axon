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
                            productId: "c178c134-9447-4f63-ac33-731728a7fddf",
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