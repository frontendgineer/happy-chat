// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import supabase from '../utils/supabase'

let profileCache = {}

function Messages({ roomId = null }) {
  const [messages, setMessages] = useState([])
  const messagesRef = useRef(null)

  const fetchMessages = async () => {
    const { data } = await supabase
      .from(`messages`)
      .select('*, profile: profiles(id, username)') //aliasing profiles to profile
      .match({ room_id: roomId })
      .order('created_at')

    if (!data) {
      alert('no messages')
      return
    }

    data
      .map((message) => message.profile)
      .forEach((profile) => {
        profileCache[profile.id] = profile
      })

    setMessages(data)

    // scroll the content to the bottom on page load or when message is added
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const subscription = supabase
      .from(`messages:room_id=eq.${roomId}`)
      .on('INSERT', (payload) => {
        console.log('payload.new', payload.new)
        // TODO: add new user to the cache if their profile does not exist
        setMessages((current) => [
          ...current,
          { ...payload.new, profile: profileCache[payload.new.profile_id] },
        ])
        // scroll the content to the bottom on page load or when message is added
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  // get the id of the logged in user
  const userId = supabase.auth.user()?.id

  return (
    <div
      className="flex-1 overflow-scroll bg-slate-100"
      ref={messagesRef}
      style={{ scrollBehavior: 'smooth' }}
    >
      <ul className="flex flex-col items-stretch justify-end space-y-1 p-4">
        {messages.map((message) => (
          <li
            key={message?.id}
            className={
              message?.profile_id === userId
                ? 'self-end rounded bg-blue-400 px-3'
                : 'self-start rounded bg-red-400 px-2'
            }
          >
            <span className="text-sm text-yellow-200">
              {message?.profile?.username}
            </span>
            <span className="block text-gray-100">{message?.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Messages
