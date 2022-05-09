// import NextAuth from "next-auth"
//import Auth0Provider from "next-auth/providers/auth0"
//import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import CredentialProvider from "next-auth/providers/credentials"
//import clientPromise from "../../../lib/mongodb"
import NextAuth from "next-auth"

export default NextAuth({
  providers: [
    // Auth0Provider({
    //         clientId: process.env.AUTH0_ID,
    //         clientSecret: process.env.AUTH0_SECRET,
    //         issuer: process.env.AUTH0_ISSUER,
    // }),
    CredentialProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.status === 200) {
          return response.json()
        }
        return null
      },
    }),
  ],
  theme: {
      colorScheme: "light",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      user && (token.user = user)
      return token
    },
    session: ({ session, token }) => {
      session.user = token.user
      if (!session.user) return null
      return session
    },
  },
})
