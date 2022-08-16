export interface ChatUser {
  id: string,
  username: string,
  groups: GroupInfo[]
}

export type Room = Omit<ChatUser, 'groups' | 'username'> & {
  name: string
};
// Backend
export interface ChatUserBackend {
  socketId: string,
  username: string
}

export interface User {
  id: string,
  username: string
}

export interface GroupInfo {
  id: string,
  name: string
  users: User[]
}

export type Group = Omit<GroupInfo, 'users'>;

export interface MessageToUser {
  id: string,
  userFromId: string,
  userToId: string,
  text: string
}

export interface MessageToGroup {
  userIdFrom: string,
  groupIdTo: string,
  text: string
}
export type Message = {
  id: string;
  text: string;
  userFromId: string;
  userToId: string;
}


export interface ChatData {
  chats: Message[],
  userFrom: User,
  userTo: User
}
export type GroupMessage = {
  id: string;
  text: string;
  userIdFrom: string;
  groupIdTo: string;
}

export interface GroupChatResponse {
  messages: GroupMessage[],
  name: string
}