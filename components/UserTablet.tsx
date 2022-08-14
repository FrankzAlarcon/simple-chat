import { ChatUser } from "../types"

interface Props {
  user: ChatUser
}

const UserTablet = ({user}: Props) => {
  return (
    <div className="px-2 bg-green-300 rounded-full w-max border-2 border-green-200">
      {user.username}
    </div>
  )
}

export default UserTablet