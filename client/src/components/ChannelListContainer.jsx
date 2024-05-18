import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';


const cookies = new Cookies();

const SideBar = ({logout}) => {
  return (
    <div className="channel-list__sidebar">

      <div className="channel-list__sidebar__icon2">
        <div className="icon1__inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" width="30">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
          </svg>

        </div>
      </div>
      <div className="channel-list__sidebar__icon2">
        <div className="icon1__inner" onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" width="30">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
        </div>
      </div>
    </div>
  )
}

const CompanyHeader = () => {
  return (
    <div className="channel-list__header">
    <p className="channel-list__header__text">
      Chat App
    </p>
  </div>
)}

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel)=>channel.type === 'team')
}

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel)=>channel.type === 'messaging')
}

const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {

  const { client } = useChatContext();

  const logout = () => {
    cookies.remove('token');
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('hashedPassword');
    cookies.remove('phoneNumber');
    window.location.reload();
  }

  const filters = {members:{$in:[client.userID]}}
  
  return (
    <>
      <SideBar logout={logout} />
      <div className="channel-list__list__wrapper">
        <CompanyHeader />
        <ChannelSearch setToggleContaine={setToggleContainer} />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelTeamFilter}
          List={(listProps)=>(
            <TeamChannelList
              {...listProps}
              type='team'
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(perviewProps) => (
            <TeamChannelPreview
              {...perviewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
              type='team'
            />
          )}
        />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelMessagingFilter}
          List={(listProps)=>(
            <TeamChannelList
              {...listProps}
              type='messaging'
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
            />
  )}
          Preview={(perviewProps) => (
            <TeamChannelPreview
              {...perviewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setToggleContainer={setToggleContainer}
              type='messaging'
            />
          )}
        />
      </div>
      </>
  )
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
  const [toggleContainer, setToggleContainer] = useState(false);

  return (
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />
      </div>

      <div className="channel-list__container-responsive"
        style={{left: toggleContainer?"0%":"-89%", backgroundColor: '#005fff'}}
      >
        <div className="channel-list__container-toggle" onClick={()=>setToggleContainer((prevToggle)=>!prevToggle)} >
        </div>
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
        />

      </div>
    </>
  )

}

export default ChannelListContainer