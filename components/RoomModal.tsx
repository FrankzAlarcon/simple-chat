import { Dialog, Transition } from '@headlessui/react'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { ChatUser, GroupInfo, Room } from '../types'
import UserTablet from './UserTablet'

interface Props {
  closeModal: () => void
  isOpen: boolean
  usersConnected: ChatUser[]
  selectedUsers: ChatUser[]
  setSelectedUsers: (users: ChatUser[]) => void
  handleSaveGroup: (groupData: GroupInfo) => void
}

export default function RoomModal({closeModal, isOpen, usersConnected, selectedUsers, setSelectedUsers, handleSaveGroup}: Props) {
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [groupName, setGroupName] = useState('');
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const filteredUsers = usersConnected.filter(user => !selectedUsers.some(selectedUser => selectedUser.username === user.username));
    setAvailableUsers(filteredUsers);
  }, [usersConnected])

  const handleSelectUser = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target
    const user = availableUsers.find(user => user.username === value)
    if(!user) {
      return
    }
    setAvailableUsers(availableUsers.filter(user => user.username !== value))
    setSelectedUsers([...selectedUsers, user])
    evt.target.value = '';
  }

  const handleCreateGroup = () => {
    if(!groupName || !selectedUsers.length) {
      setAlert(true);
      return setTimeout(() => {
        setAlert(false);
      }, 2500)
    }
    handleSaveGroup({id: groupName, name: groupName, users: selectedUsers});
    handleClose();
  }

  const handleClose = () => {
    closeModal();
    setSelectedUsers([]);
    setGroupName('');
    setAlert(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-black uppercase text-center leading-6 text-gray-900"
                  >
                    Crea una Sala
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Llena los siguientes campos para crear una sala
                    </p>
                    <div className='space-y-4'>
                      <label htmlFor="roomName" className='block'>
                        <span className='block my-1 uppercase font-bold text-xs'>Nombre de sala: </span>
                        <input
                          id='roomName'
                          type="text"
                          value={groupName}
                          onChange={(evt) => setGroupName(evt.target.value)}
                          className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'
                        />
                      </label>
                      <div className='flex flex-wrap gap-2'>
                        {
                          selectedUsers.map(user => (
                            <UserTablet key={user.id} user={user} />
                          ))
                        }
                      </div>
                      <label htmlFor="inviteUsers" className='block'>
                        <span className='block my-1 uppercase font-bold text-xs'>Invita usuarios: </span>
                        <input
                          list='users'
                          id='inviteUsers'
                          onChange={handleSelectUser}                          
                          className='p-2 w-full bg-gray-100 shadow-sm border-b-2 border-gray-300 hover:bg-gray-300 transition-colors duration-500'
                        />
                        <datalist id='users'>
                          {
                            availableUsers.map(user => (
                              <option key={user.id} value={user.username} className='text-xl'>{user.username}</option>
                            ))
                          }
                        </datalist>
                      </label>
                      {
                        alert && (<p className='text-center font-bold p-2 text-xs uppercase'><span className='bg-red-500 p-2 text-white'>Debes llenar todos los campos</span></p>)
                      }
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 duration-300"
                      onClick={handleCreateGroup}
                    >
                      Guardar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
