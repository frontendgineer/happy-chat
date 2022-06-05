// @ts-nocheck
import type { NextPage } from 'next';
import {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Input, Button } from '@supabase/ui'
import { useRouter } from 'next/router'
import Link from 'next/link'
import supabase from '../utils/supabase'
import Messages from '../components/messages'

const Home: NextPage = () => {
  const router = useRouter();

  const handleCreateRoom = async () => {

    const { data, error } = await supabase.rpc('create_room').single()
    console.log({data})

    if (error) {
      alert(error.message)
      return
    }

    //console.log({data, error})
    router.push(`/rooms/${data?.id}`)
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
            <span className="pointer">Happy Chat</span>
            <button
              className="ml-6 rounded bg-green-200 px-2 py-1 text-sm"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>

            <Link href="/rooms/6f4c207e-eada-4ef2-9205-7669078a4090">
              <a className="ml-6 items-center rounded bg-red-200 px-2 py-2 text-sm">
                Join the Classic Room
              </a>
            </Link>
          </h1>
        </div>
      </main>
    </div>
  )
}

export default Home
