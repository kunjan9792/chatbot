import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatApp.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ChatApp({ user, onLogout }) {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const token = user.token || localStorage.getItem('chatapp_token');

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  const fetchFriends = async () => {
    const res = await axios.get(`${API_URL}/api/friends/list`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFriends(res.data.friends);
    setFriendRequests(res.data.friendRequests);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/messages`, {
        params: { user1: user._id, user2: selectedUser._id },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (e) {
      setMessages([]);
    }
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    await axios.post(`${API_URL}/api/messages`, {
      sender: user._id,
      recipient: selectedUser._id,
      message: input
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInput('');
    fetchMessages();
  };

  // FRIEND REQUEST HANDLING
  const handleAcceptRequest = async (fromUserId) => {
    await axios.post(`${API_URL}/api/friends/respond`, {
      fromUserId,
      accept: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchFriends();
  };
  const handleRejectRequest = async (fromUserId) => {
    await axios.post(`${API_URL}/api/friends/respond`, {
      fromUserId,
      accept: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchFriends();
  };
  const handleSendRequest = async () => {
    setSearchResult(null);
    if (!searchUsername.trim()) return;
    // Find user by username (search endpoint not yet implemented, so fallback: try to send request)
    try {
      // You'd normally search for user and display, but for now, try to send request
      const res = await axios.post(`${API_URL}/api/friends/request`, {
        toUserId: searchUsername // for now, expects userId, but ideally, implement /api/users/search
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResult({ success: true, message: 'Friend request sent (if user exists)' });
    } catch (err) {
      setSearchResult({ success: false, message: err.response?.data?.error || 'Failed to send request' });
    }
    setSearchUsername('');
  };

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="user-info">
          <img src={user.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user.username}`} alt="avatar" className="avatar" />
          <span>{user.username}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="friend-section">
          <h4>Friends</h4>
          <ul className="user-list">
            {/* Chatbot user at the top */}
            <li
              className={selectedUser && selectedUser._id === 'chatbot' ? 'selected' : ''}
              onClick={() => setSelectedUser({ _id: 'chatbot', username: 'AI Chatbot', avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712037.png' })}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <img src={'https://cdn-icons-png.flaticon.com/512/4712/4712037.png'} alt="avatar" className="avatar-sm" />
              <span style={{ flex: 1 }}>AI Chatbot</span>
            </li>
            {friends.length === 0 && <li style={{ color: '#bbb', textAlign: 'center' }}>No friends yet</li>}
            {friends.map(u => (
              <li key={u._id} className={selectedUser && selectedUser._id === u._id ? 'selected' : ''} onClick={() => setSelectedUser(u)}>
                <img src={u.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${u.username}`} alt="avatar" className="avatar-sm" />
                {u.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="friend-requests">
          <h4>Requests</h4>
          <ul className="user-list">
            {friendRequests.length === 0 && <li style={{ color: '#bbb', textAlign: 'center' }}>No requests</li>}
            {friendRequests.map(u => (
              <li key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <img src={u.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${u.username}`} alt="avatar" className="avatar-sm" />
                <span style={{ flex: 1 }}>{u.username}</span>
                <button style={{ background: '#6dd5ed', border: 'none', color: '#fff', borderRadius: 10, padding: '2px 8px', cursor: 'pointer' }} onClick={() => handleAcceptRequest(u._id)}>Accept</button>
                <button style={{ background: '#e74c3c', border: 'none', color: '#fff', borderRadius: 10, padding: '2px 8px', cursor: 'pointer' }} onClick={() => handleRejectRequest(u._id)}>Reject</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="add-friend">
          <input
            type="text"
            value={searchUsername}
            onChange={async e => {
              setSearchUsername(e.target.value);
              if (e.target.value.trim().length > 1) {
                // Search users
                try {
                  const res = await axios.get(`${API_URL}/api/users/search?q=${encodeURIComponent(e.target.value)}`);
                  // Filter out self, friends, and pending requests
                  const excludeIds = [user._id, ...friends.map(f => f._id), ...friendRequests.map(f => f._id)];
                  setSearchResult(res.data.filter(u => !excludeIds.includes(u._id)));
                } catch {
                  setSearchResult([]);
                }
              } else {
                setSearchResult(null);
              }
            }}
            placeholder="Search username to add friend"
            style={{ width: '90%', margin: '8px 0', padding: '6px', borderRadius: 8, border: '1px solid #eee' }}
          />
          {searchResult && Array.isArray(searchResult) && searchResult.length > 0 && (
            <ul className="user-list" style={{ maxHeight: 120, overflowY: 'auto', margin: '4px 0 8px 0' }}>
              {searchResult.map(u => (
                <li key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={u.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${u.username}`} alt="avatar" className="avatar-sm" />
                  <span style={{ flex: 1 }}>{u.username}</span>
                  <button style={{ background: '#2193b0', border: 'none', color: '#fff', borderRadius: 10, padding: '2px 8px', cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await axios.post(`${API_URL}/api/friends/request`, { toUserId: u._id }, { headers: { Authorization: `Bearer ${token}` } });
                        setSearchResult(searchResult.filter(x => x._id !== u._id));
                        fetchFriends();
                      } catch (err) {
                        alert(err.response?.data?.error || 'Failed to send request');
                      }
                    }}
                  >Send Request</button>
                </li>
              ))}
            </ul>
          )}
          {searchResult && Array.isArray(searchResult) && searchResult.length === 0 && (
            <div style={{ color: '#bbb', fontSize: '0.9em', margin: '4px 0 8px 0' }}>No users found</div>
          )}
          <div style={{ marginTop: 8 }}>
            <h5 style={{ margin: '8px 0 2px 0', fontSize: '1em' }}>All Users</h5>
            <AllUsersList user={user} friends={friends} friendRequests={friendRequests} token={token} fetchFriends={fetchFriends} />
          </div>
        </div>
      </aside>
      <main className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img src={selectedUser.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${selectedUser.username}`} alt="avatar" className="avatar-sm" />
              <span className="chat-header-name">{selectedUser.username}</span>
            </div>
            <div className="chat-messages">
              {loading ? <div className="loading">Loading...</div> :
                selectedUser._id === 'chatbot' ? (
                  messages.map((msg, idx) => {
                    const isSent = msg.sender === user._id || msg.sender === 'user';
                    const isBot = msg.sender === 'bot';
                    return (
                      <div key={idx} className={`chat-row ${isSent ? 'sent-row' : 'received-row'}`}> 
                        {!isSent && (
                          <img
                            src={'https://cdn-icons-png.flaticon.com/512/4712/4712037.png'}
                            alt="avatar"
                            className="avatar-sm chat-avatar"
                          />
                        )}
                        <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`} style={isBot ? { background: '#fffbe7', border: '2px solid #ffe066', color: '#222' } : {}}>
                          {!isSent && <div className="bubble-name">AI Chatbot</div>}
                          <span>{msg.message}</span>
                          <div className="bubble-meta">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                        </div>
                        {isSent && (
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user.username}`}
                            alt="avatar"
                            className="avatar-sm chat-avatar"
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  messages.map((msg, idx) => {
                    const isSent = msg.sender._id === user._id;
                    return (
                      <div key={idx} className={`chat-row ${isSent ? 'sent-row' : 'received-row'}`}>
                        {!isSent && (
                          <img
                            src={msg.sender.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${msg.sender.username}`}
                            alt="avatar"
                            className="avatar-sm chat-avatar"
                          />
                        )}
                        <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}> 
                          {!isSent && (
                            <div className="bubble-name">{msg.sender.username}</div>
                          )}
                          <span>{msg.message}</span>
                          <div className="bubble-meta">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                        </div>
                        {isSent && (
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user.username}`}
                            alt="avatar"
                            className="avatar-sm chat-avatar"
                          />
                        )}
                      </div>
                    );
                  })
                )}
            </div>
            <form className="chat-input" onSubmit={async (e) => {
              e.preventDefault();
              if (!input.trim()) return;
              if (selectedUser._id === 'chatbot') {
                // Chatbot message
                setMessages(msgs => [...msgs, { sender: 'user', message: input, timestamp: new Date() }]);
                setInput('');
                setLoading(true);
                try {
                  const res = await axios.post(`${API_URL}/api/messages/bot`, { message: input }, { headers: { Authorization: `Bearer ${token}` } });
                  setMessages(msgs => [...msgs, { sender: 'bot', message: res.data.message, timestamp: new Date() }]);
                } catch {
                  setMessages(msgs => [...msgs, { sender: 'bot', message: 'Sorry, the chatbot could not reply.', timestamp: new Date() }]);
                }
                setLoading(false);
              } else {
                // Only call handleSend for real users
                await handleSend(e);
              }
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                autoFocus
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-chat">Select a friend or the AI Chatbot to start chatting</div>
        )}
      </main>
    </div>
  );
}

// List all users except self, friends, and requests
function AllUsersList({ user, friends, friendRequests, token, fetchFriends }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        // Exclude self, friends, requests
        const excludeIds = [user._id, ...friends.map(f => f._id), ...friendRequests.map(f => f._id)];
        setAllUsers(res.data.filter(u => !excludeIds.includes(u._id)));
      } catch {
        setAllUsers([]);
      }
      setLoading(false);
    };
    fetchAll();
  }, [user._id, friends, friendRequests]);

  if (loading) return <div style={{ color: '#bbb', fontSize: '0.9em' }}>Loading users...</div>;
  if (!allUsers.length) return <div style={{ color: '#bbb', fontSize: '0.9em' }}>No users found</div>;
  return (
    <ul className="user-list" style={{ maxHeight: 120, overflowY: 'auto', margin: 0 }}>
      {allUsers.map(u => (
        <li key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src={u.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${u.username}`} alt="avatar" className="avatar-sm" />
          <span style={{ flex: 1 }}>{u.username}</span>
          <button style={{ background: '#2193b0', border: 'none', color: '#fff', borderRadius: 10, padding: '2px 8px', cursor: 'pointer' }}
            onClick={async () => {
              try {
                await axios.post(`${API_URL}/api/friends/request`, { toUserId: u._id }, { headers: { Authorization: `Bearer ${token}` } });
                fetchFriends();
              } catch (err) {
                alert(err.response?.data?.error || 'Failed to send request');
              }
            }}
          >Send Request</button>
        </li>
      ))}
    </ul>
  );
}

export default ChatApp;
