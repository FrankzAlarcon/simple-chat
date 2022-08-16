import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Group from '../components/Group';
import { Layout } from '../components/Layout';
import RoomModal from '../components/RoomModal';
import User from '../components/User';
import { ChatUser, GroupInfo, Room } from '../types';

export const socket = io('http://localhost:3001');

const Home: NextPage = () => {
  const [user, setUser] = useState<ChatUser>({id: '', username: '', groups: []});
  const [usersConnected, setUsersConnected] = useState<ChatUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<ChatUser[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [input, setInput] = useState('');
  const [groupId, setGroupId] = useState('');
  
  useEffect(() => {
    try {
      const name = localStorage.getItem('user');      
      if(!name) {
        return;      
      }
      const userConnected: ChatUser = JSON.parse(name);
      socket.emit('new user', userConnected.username);
      socket.emit('leave group', groupId);
      socket.on('current user', (userBk: ChatUser, usersConnected: ChatUser[]) => {
        setUser(userBk);
        setUsersConnected(usersConnected);
        setShowForm(false);
      }) 
      setShowForm(false);
    } catch (error) {
      localStorage.removeItem('user');
    }
  }, []);



  const handleUsername = () => {
    if(!input) {
      return;
    }
    socket.emit('new user', input);
    socket.on('current user', (userx: ChatUser, usersConnected: ChatUser[]) => {
      setUser(userx);
      localStorage.setItem('user', JSON.stringify(userx));
      setUsersConnected(usersConnected);
      setShowForm(false);
    })        
  }

  useEffect(() => {
    socket.on('add user', (users: ChatUser[]) => {
      const storagedUser = localStorage.getItem('user')
      if(!storagedUser) {
        setShowForm(true);
        return;
      }
      const filteredUsers = users.filter(userConnected => userConnected.id !== JSON.parse(storagedUser).id);
      setUsersConnected(filteredUsers);
    });

    socket.on('group created', (group: GroupInfo) => {      
      const userConnected = JSON.parse((localStorage.getItem('user') as string));
      userConnected.groups.push(group);
      setUser(userConnected);
    })

    socket.on('added to group', (group: GroupInfo) => {
      const userConnected = JSON.parse((localStorage.getItem('user') as string));
      userConnected.groups.push(group);
      setUser(userConnected);
    })

    socket.on('remove user', (users: ChatUser[]) => {
      const storagedUser = localStorage.getItem('user')
      if(!storagedUser) {
        setShowForm(true);
        return;
      }
      const filteredUsers = users.filter(userConnected => userConnected.id !== JSON.parse(storagedUser).id);
      setUsersConnected(filteredUsers);
    });
  }, []);

  const closeModal = () => {  
    setOpenModal(false);
  }

  const handleCreateGroup = (groupData: GroupInfo) => {
    socket.emit('add group', user, groupData);    
  }

  const handleOpenModal= () => {
    setOpenModal(true)
  }

  const handleCloseSession = () => {
    localStorage.removeItem('user');
    setShowForm(true);
    setUsersConnected([]);
    setUser({id: '', username: '', groups: []});
    socket.emit('close session');
  }

  return (
    <Layout titleName='Home'>
      <main className='md:flex md:flex-wrap md:justify-around md:gap-5 p-2 space-y-4 md:space-y-0 min-h-[80vh]'>
        {
          !showForm ? (
            <>
              <section className='w-full md:w-5/12 lg:w-5/12'>
                <div className='my-2'>
                  <h2 className='text-center font-black text-xl uppercase text-orange-500'>Usuarios conectados</h2>
                  <p className='text-center text-xs font-black uppercase'>Inicia una conversación</p>
                </div>
                <div className='min-h-[250px] border-2 border-green-600'>
                  {
                    usersConnected.map((userConnected) => (
                      <User key={userConnected.id} user={user} receiver={userConnected} />
                    ))
                  }
                </div>
              </section>
              <section className='w-full md:w-5/12 lg:w-5/12'>
              <div className='my-2'>
                  <h2 className='text-center font-black text-xl uppercase text-orange-500'>Tus Grupos</h2>
                  <p className='text-center text-xs font-black uppercase'>Ingresa a un grupo</p>
                  
                </div>
                <div className='min-h-[250px] border-2 border-green-600'>
                  {
                    (user.groups && user.groups.length) > 0 ? (
                      user.groups.map((group) => (
                        <Group key={group.id} group={group} user={user} setGroupId={setGroupId} />
                      ))
                    ) : (
                      <p
                        className='uppercase font-bold text-center text-xs p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 '
                      >Aun no tienes grupos</p>
                    )
                  }
                </div>
                <button
                  className='mx-auto w-full my-2 p-2 bg-green-400 hover:bg-green-500 transition-colors duration-500 uppercase font-semibold text-white'
                  onClick={handleOpenModal}
                >Crear Grupo</button>
              </section>

                <button
                  className='bg-green-400 md:w-3/12 p-2 md:h-10 uppercase font-bold text-sm w-full text-white hover:bg-green-500 transition-colors duration-500 md:flex-none'
                  onClick={handleCloseSession}
                >Salir</button>                
              
            </>
          ) : (
            <section>
              <label htmlFor="username">
                <span className='inline-block mb-1 uppercase font-semibold text-sm'>Ingresa un nombre de usuario</span>
                <input 
                  type="text"
                  id='username'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'
                />
              </label>
              <button
                className='w-full my-2 bg-green-500 hover:bg-green-600 transition-colors duration-300 p-2 text-white uppercase font-bold'
                onClick={handleUsername}
              >Guardar</button>
            </section>
          )
        }
      <RoomModal
        isOpen={openModal}
        closeModal={closeModal}
        usersConnected={usersConnected}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        handleSaveGroup={handleCreateGroup}
      />
      </main>
    </Layout>
  )
}

export default Home
