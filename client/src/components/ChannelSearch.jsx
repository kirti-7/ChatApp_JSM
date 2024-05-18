import React, { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { ResultsDropdown } from './';

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([]);
    const [directChannels, setDirectChannels] = useState([]);

    useEffect(() => {
      if(!query){
          setTeamChannels([]);
          setDirectChannels([]);
      }
    }, [query])
    

    const getChannels = async (text) => {
        try {
            // todo: fetch comments
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: {$in:[client.userID]}
            });
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text },
            })

            const [channels, {users}] = await Promise.all([channelResponse, userResponse])

            if (channels.length) setTeamChannels(channels);
            if (users.length) setDirectChannels(users);


        } catch (error) {
            setQuery('');
        }
    }

    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        setQuery(event.target.value);
        getChannels(event.target.value);
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

  return (
      <div className='channel-search__container'>
          <div className="channel-search__input__wrapper">
              <div className="channel-search__input__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6" width="20">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
              </div>
              <input
                  className='channel-search__input__text'
                  type='text'
                  placeholder='Search...'
                  value={query}
                  onChange={onSearch}
              />
          </div>

          {query && (
              <ResultsDropdown
                  teamChannels={teamChannels}
                  directChannels={directChannels}
                  loading={loading}
                  setChannel={setChannel}
                  setQuery={setQuery}
                  setToggleContainer={setToggleContainer}
              />
          )}

    </div>
  )
}

export default ChannelSearch