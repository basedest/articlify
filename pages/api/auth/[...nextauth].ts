import CredentialProvider from "next-auth/providers/credentials"
import NextAuth, { Awaitable, Session } from "next-auth"

export default NextAuth({
  providers: [
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
    jwt: ({ token, user }:any) => {
      user && (token.user = user)
      return token
    },
    session: ({ session, token }:any) => {
      session.user = token.user
      if (!session.user) return null
      return session
    },
  } as any,
})
