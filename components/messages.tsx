import React, { useEffect, useState } from 'react'
import supabase from '../utils/supabase'

function Messages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*, profile: profiles(username)') //aliasing profilesto profile
    if (!data) {
      alert('no messages')
      return
    }
    setMessages(data)
  };

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const subscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        console.log('payload.new', payload.new)
        // setMessages((current) => [...current, payload.new])
        fetchMessages()
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  const userId = supabase.auth.user()?.id

  return (
    <div className="flex-1 overflow-scroll">
      <ul className="flex flex-col items-stretch justify-end space-y-1 bg-slate-200 p-4">
        {messages.map((message) => (
          <li
            key={message?.id}
            className={
              message?.profile_id === userId
                ? 'self-end rounded bg-blue-400 px-3'
                : 'self-start rounded bg-red-400 px-2'
            }
          >
            <span className="text-sm text-yellow-200">{message?.profile.username}</span>
            <span className="block text-gray-100">{message?.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Messages
