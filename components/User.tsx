import { useRouter } from 'next/router';
import React from 'react'
import { ChatUser } from '../types';

interface Props {
  props: {
    user: ChatUser,
    receiver: ChatUser,
  }
}

const User = ({user, receiver}: Props['props']) => {
  const router = useRouter();
  const handleChat = () => {
    router.push(`/chat/${user.id}-simplechat-${receiver.id}`);
  }

  return (
    <button
      className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'
      onClick={handleChat}
    >
      {receiver.username}
    </button>
  )
}

export default User