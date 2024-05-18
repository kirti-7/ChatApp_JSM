import React, { useEffect, useState } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react';

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}

    </div>
  )
}

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) => prevUsers.filter(prevUser => prevUser !== user.id));
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected(!selected);
  }

  return (
    // <div className="user-item__wrapper" onClick={(event)=>setSelected(!selected)}>
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className='user-list__name'>{user.fullName || user.id}</p>
      </div>
      {selected ? <div style={{ marginLeft: '2px' }}>
        <svg width={28} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
        </svg>
      </div>
      :<div style={{ marginLeft: '2px' }}>
        <svg width={28} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
    }
    </div>
  )
}

const UserList = ({ setSelectedUsers }) => {

  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      if(loading) return;

      setLoading(true);

      try {
        const response = await client.queryUsers(
          { id: { $ne: client.userID } },
          { id: 1 },
          { limit: 8 }
        );


        console.log(response.users);
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    }

    if (client) getUsers();
  }, [])
  

  if (error) {
    return (
      <ListContainer>
        <div className='user-list__message'>
          Error Loading users, please refresh and try again.
        </div>
      </ListContainer>
    )
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className='user-list__message'>
          No users found.
        </div>
      </ListContainer>
    )
  }



  return (
    <ListContainer>

      {loading ? <div className='user-list__message'>
        Loading users...
      </div> : (
        users?.map((user, i) => (<UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />))
      )
      }
    </ListContainer>
  )
}

export default UserList