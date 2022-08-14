import { GetServerSidePropsContext, NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../../components/Layout';
import { ChatData, ChatUser, Message, MessageToUser, User } from '../../types';
import { socket } from '../index';

interface Props {
  props: {
    chats: Message[],
    userFrom: User,
    userTo: User,
  },
  message: MessageToUser
}

let wasExecuted = false;

const Personal: NextPage<Props['props']> = ({chats, userFrom, userTo}) => {
  const [messages, setMessages] = useState(chats);
  const [text, setText] = useState('');


  const chatBox = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if(chatBox.current?.scrollTop !== undefined) {
      chatBox.current!.scrollTop = chatBox.current.scrollHeight;           
    } 
  }

  useEffect(() => {
    const name = localStorage.getItem('user');      
    if(!name || wasExecuted) {
      return;      
    }
    const userConnected: ChatUser = JSON.parse(name);
    socket.emit('new user', userConnected.username);
    wasExecuted = true;
  }, [])
  useEffect(() => {
    scrollToBottom();
  }, [messages])
  
  const onSendMessage = () => {    
    if(!text) {
      return;
    }
    const messageData = {userFromId: userFrom.id, userToId: userTo.id, text}
    socket.emit('new message', messageData);
    setText('');
  }

  const handleSendMessage = (evt: any) => {
    evt.preventDefault();
    if(evt.key) {
      if(evt.key === 'Enter') {
        onSendMessage();
        return
      }
    } else {
      onSendMessage();
    }
  }
  
  useEffect(() => {
    socket.on('send message', (messageInfo: Props['message']) => {
      setMessages([...messages, messageInfo]);
    })
    socket.on('sended message', (messageInfo: Props['message']) => {
      setMessages([...messages, messageInfo]);
    })
  }, [messages]);

  return (
    <div className='bg-slate-100 min-h-screen w-full'>
      <Layout titleName='Mensajería'>
        <div className='w-full md:w-4/5 lg:w-2/3 mx-auto p-2'>
          <main className=''>
            <section className='flex flex-col'>
              <div ref={chatBox} className='max-h-[500px] h-[500px] bg-white px-2 my-1 border-2 overflow-y-scroll'>
                <div className='flex flex-auto flex-col justify-end'>
                  {
                    messages?.map((item) => {
                      return (
                        <div key={item.id} className={`flex ${item.userToId !== userTo.id ? '': 'justify-end'}`}>
                          <p className={`${item.userToId !== userTo.id ? 'bg-slate-400' : 'bg-lime-400'} inline-block px-4 rounded-full my-1`}>{item.text}</p>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </section>
            <section>
              <div className='flex gap-4'>
                <input
                  type="text"
                  className='w-full p-2 border-2 border-gray-300'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyUp={handleSendMessage}
                />
                <button
                  type='button'
                  className='bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors duration-300'
                  onClick={onSendMessage}                
                >Enviar</button>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </div>
  )
}

export async function getServerSideProps({params}: GetServerSidePropsContext) {
  if(params?.id) {
    try {
      const [from, to] = (params.id as string).split('-simplechat-');
      const rawData = await fetch(`http://localhost:3001/api/user-chat/from/${from}/to/${to}`);    
      const {data}: {data: ChatData} = await rawData.json();
      return {
        props: {
          chats: data.chats ?? [],
          userFrom: data.userFrom ?? null,
          userTo: data.userTo ?? null,        
        }
      }      
    } catch (error) {
      return {
        notFound: true
      }
    }
  } else {
    return {
      notFound: true
    }
  }
}

export default Personal;