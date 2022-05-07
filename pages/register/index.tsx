import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react"
import FormInput from "../../components/FormInput"

const Register = () => {
  const router = useRouter()

  const { data: session } = useSession()

  if (session) {
    router.push('/')
  }

  const [message, setMessage] = useState('')
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 4,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: values.password,
      required: true,
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const {username, email, password} = values
    fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({username, email, password}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 400)
        setMessage('User with provided credentials already exists')
        return response.json()
    }).then(data => {
      if (message) return
      console.log(data)
      signIn("credentials", {username, password})
      router.push('/')
    })
    .catch(console.error)
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  return (
    <div className="register">
      {
        message 
        ? <div><p>{message}</p><button onClick={(e) => setMessage('')}>ok</button></div>
        : <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          {
            inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))
          }
          <button>Submit</button>
          {message && <p>{message}</p>}
          <p>Already have an account?{' '}
            <Link href={'/login'}>
              <a>Log in</a>
            </Link>
          </p>
          </form>
        }
      </div>
  )
}

export default Register