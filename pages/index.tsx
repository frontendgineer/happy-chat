// @ts-nocheck
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Input, Button } from '@supabase/ui'
import supabase from '../utils/supabase'
import Messages from '../components/messages'

const Home: NextPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.currentTarget

    const { message } = Object.fromEntries(new FormData(form))

    if (typeof message === 'string' && message.trim().length !== 0) {
      // console.log({ message })
      form.reset()

      const { error, data } = await supabase
        .from('messages')
        .insert({ content: message })

      // console.log({error, data})
      if (error) {
        alert(error.message)
        return
      }
    }
  }
  const handleCreateRoom = async () => {
    await supabase
      .from('rooms')
      .insert({name: "Happy Room"}, { returning: 'minimal' })
  
    const {data} = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false} )
      .limit(1)
      .single()

    console.log({data})
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Happy Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-full w-full flex-1 flex-col items-stretch bg-blue-400 px-20">
        <div className="bg-pink-100">
          <h1 className="flex bg-orange-200 px-4 py-2 text-3xl">
            <span>Happy Chat</span>
            <button
              className="ml-6 rounded bg-green-200 px-2 py-1 text-sm"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </h1>
        </div>
        <Messages />
        <form onSubmit={handleSubmit} className="bg-yellow-400 p-2">
          <Input type="text" className="" name="message" />
        </form>
      </main>
    </div>
  )
}

export default Home
