import React from 'react'
import { Input, Button } from '@supabase/ui'
import supabase from '../utils/supabase'
import {useRouter} from 'next/router'

function Login() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { email, username, password } = Object.fromEntries(
      new FormData(e.currentTarget)
    )

    console.log({ email, password })

    if (typeof email === 'string' && typeof password === 'string') {
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });

      if(error) {
        alert(error.message)
        return;
      }
      router.push('/')
    }
  }
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
      <form className="w-full space-y-6" onSubmit={handleSubmit}>
        <Input type="email" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </form>
    </div>
  )
}

export default Login
