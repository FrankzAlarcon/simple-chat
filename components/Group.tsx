import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { socket } from '../pages'
import { ChatUser, GroupInfo } from '../types'

interface Props {
  props: {
    user: ChatUser,
    group: GroupInfo,
    setGroupId: (id: string) => void,
  }
}

const Group = ({group, user, setGroupId}: Props['props']) => {

  const router = useRouter();

  const handleGroup = () => {
    router.push(`/chat/room/${user.id}-simplechat-${group.id}`);
    socket.emit('enter to group', group.id);
    setGroupId(group.id);
  }

  return (
    <button
      className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'
      onClick={handleGroup}
    >
      {group.name}
    </button>
  )
}

export default Group