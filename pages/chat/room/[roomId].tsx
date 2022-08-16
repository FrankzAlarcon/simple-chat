import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '../../../components/Layout';
import { ChatUser, GroupChatResponse, GroupMessage, MessageToGroup } from '../../../types';
import { socket } from '../../index';

interface Props {
  props: {
    chats: GroupMessage[],
  },
  message: GroupMessage
}


const Room: NextPage<Props['props']> = ({chats}) => {
  const [user, setUser] = useState<ChatUser>({id: '', username: '', groups: []});
  const [messages, setMessages] = useState(chats);
  const [text, setText] = useState('');
  const [groupId, setGroupId] = useState('');
  const router = useRouter();


  const chatBox = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    if(chatBox.current?.scrollTop !== undefined) {
      chatBox.current!.scrollTop = chatBox.current.scrollHeight;           
    } 
  }

  useEffect(() => {
    const groupId = router.asPath.split('-simplechat-')[1];
    setGroupId(groupId);
    const name = localStorage.getItem('user');      
    if(!name) {
      return;      
    }
    const userConnected: ChatUser = JSON.parse(name);
    socket.emit('new user', userConnected.username);
    socket.emit('enter to group', groupId);
    setUser(userConnected);
  }, [])
  useEffect(() => {
    scrollToBottom();
  }, [messages])
  
  const onSendMessage = () => {    
    if(!text) {
      return;
    }
    const messageData: MessageToGroup = {userIdFrom: user.id, groupIdTo: groupId, text}
    socket.emit('group message', messageData);
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
    socket.on('send group message', (messageInfo: Props['message']) => {
      console.log(messageInfo)
      setMessages([...messages, messageInfo]);
    });
    socket.on('sended group message', (messageInfo: Props['message']) => {
      console.log(messageInfo)
      setMessages([...messages, messageInfo]);
    });
  }, [messages]);

  return (
    <div className='bg-slate-100 min-h-screen w-full'>
      <Layout titleName='Mensajería'>
        <div className='w-full md:w-4/5 lg:w-2/3 mx-auto p-2'>
          <main>
            <section className='flex flex-col'>
              <div ref={chatBox} className='max-h-[500px] h-[500px] bg-white px-2 my-1 border-2 overflow-y-scroll'>
                <div className='flex flex-auto flex-col justify-end'>
                  {
                    messages?.map((item) => {
                      return (
                        <div key={item.id} className={`flex ${item.userIdFrom !== user.id ? '': 'justify-end'}`}>
                          <p className={`${item.userIdFrom !== user.id ? 'bg-slate-400' : 'bg-lime-400'} inline-block px-4 rounded-full my-1`}>{item.text}</p>
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
  if(params?.roomId) {
    try {
      const [userId, groupId] = (params.roomId as string).split('-simplechat-');
      const rawData = await fetch(`http://localhost:3001/api/group-chat/user/${userId}/group/${groupId}`);    
      const data: GroupChatResponse = await rawData.json();
      return {
        props: {
          chats: data.messages,       
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

export default Room;