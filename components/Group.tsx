import { NextPage } from 'next'
import React from 'react'

interface Props {
  props: {
    name: string
  }
}

const Group = ({name}: Props['props']) => {
  return (
    <button className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'>
      {name}
    </button>
  )
}

export default Group