import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react"
import FormInput from "../../components/FormInput"

const Login = () => {
  const router = useRouter()
  const { data: session } = useSession()

  if (session) {
    router.push('/')
  }

  const [message, setMessage] = useState('')
  const [values, setValues] = useState({
    username: "",
    password: "",
  })

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true,
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const {username, password} = values
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setMessage(data.message)
        return
      }
      signIn("credentials", {username, password})
    })
    .catch(console.error)
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  return (
    <div className="register">
      { message 
        ? <div><p>{message}</p><button onClick={(e) => setMessage('')}>ok</button></div>
        : <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
            />
          ))}
          <button>Submit</button>
          <p>Not registered?{' '}
            <Link href={'/register'}>
              <a>Create an account</a>
            </Link>
          </p>
          </form>
      }
    </div>
  )
}

export default Login