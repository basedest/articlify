import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export default NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  theme: {
    colorScheme: "light",
  },
  // callbacks: {
  //   async jwt({ token }) {
  //     token.userRole = "admin"
  //     return token
  //   },
  // },

})
