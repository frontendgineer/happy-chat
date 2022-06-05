// @ts-nocheck
import Head from 'next/head'
import Image from 'next/image'
import { Input, Button } from '@supabase/ui'
import supabase from '../../utils/supabase'
import Messages from '../../components/messages'
import { useRouter } from 'next/router'

const Room = () => {
  const router = useRouter()

  const roomId = router.query.id as string;

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.currentTarget

    const { message } = Object.fromEntries(new FormData(form))

    if (typeof message === 'string' && message.trim().length !== 0) {
      // console.log({ message })
      form.reset()

      const { error, data } = await supabase
        .from('messages')
        .insert({ content: message, room_id: roomId })

      // console.log({error, data})
      if (error) {
        alert(error.message)
        return
      }
    }
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
          </h1>
        </div>

        {roomId && <Messages roomId={roomId} />}

        <form onSubmit={handleSubmit} className="bg-yellow-400 p-2">
          <Input type="text" className="" name="message" />
        </form>
        
      </main>
    </div>
  )
}

export default Room;
