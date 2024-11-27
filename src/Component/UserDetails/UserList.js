import React, {useEffect, useState} from 'react'
import './UserList.css'
import UserApi from '../../Api/UserApi';
import { useNavigate } from 'react-router-dom';

export const UserList = () => {
  const [loading, setLoading] = useState(true);
  const[data,setData] = useState([
    // { id: 1, userName: 'John Doe', userMobile:'8943617935',userEmail: 'john@example.com', userRole:'ADMIN', shopsCount: 2, userPassword:'' },
    // { id: 2, userName: 'Jane Smith', userMobile:'8943617935', userEmail: 'jane@example.com', userRole:'ADMIN', shopsCount: 2, userPassword:'' },
    // { id: 3, userName: 'Alice Johnson', userMobile:'8943617935', userEmail: 'alice@example.com', userRole:'ADMIN', shopsCount: 2, userPassword:'' },
    // { id: 4, userName: 'Bob Brown', userMobile:'8943617935', userEmail: 'bob@example.com', userRole:'ADMIN', shopsCount: 2, userPassword:'' },
  ]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [createData, setCreateData] = useState({ userName: '', userMobile:'',userEmail: '', userRole: '', userPassword:'' });
  const [open, setOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCreateOpen = () => setCreateOpen(true);
  const handleClose = () => setOpen(false);
  const handleCreateclose = () => setCreateOpen(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');



  useEffect(()=>{
    setLoading(true);
    UserApi.get('api/user/getAll',
    {
      headers:{'Content-Type':'application/json'}
    })
    .then(res =>{
      console.log(res);
      console.log(res.data);
      setData(res.data)
      setLoading(false);
    }).catch(ex =>{
      setLoading(false);
      if(ex.response.status === 403){
        sessionStorage.removeItem('accessToken')
        navigate("/login")
      }
      console.log("Not able to access the API")
    })
  },[navigate])

  const saveUserApi = (newUser) =>{
    setLoading(true);
    UserApi.post('api/user',newUser)
    .then(res =>{
      setLoading(false);
    }).catch(ex =>{
      setLoading(false);
      if(ex.response.status === 403){
        sessionStorage.removeItem('accessToken')
        navigate("/login")
      }
      console.log("Not able to access the API")
    })
  }

  const updateUserApi = (updatedUser) => {
    setLoading(true);
    UserApi.patch('api/user',updatedUser)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      setLoading(false);
      if(ex.response.status === 403){
        sessionStorage.removeItem('accessToken')
        navigate("/login")
      }
      console.log("Not able to access the API")
    })
  }

  const deleteUserApi = (userId) =>{
    setLoading(true);
    UserApi.delete('api/user?userId='+userId)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      setLoading(false);
      if(ex.response.status === 403){
        sessionStorage.removeItem('accessToken')
        navigate("/login")
      }
      console.log("Not able to access the API")
    })
  }

  const handleUpdateClick = (id) => {
    const userToUpdate = data.find((shop) => shop.id === id);

    setEditingData({ id, userName: userToUpdate.userName, userMobile: userToUpdate.userMobile, userEmail: userToUpdate.userEmail, userRole: userToUpdate.userRole, userPassword: userToUpdate.userPassword });
    handleOpen();
  };

  const handleEmailAvailability = (email) => {
    UserApi.get('api/user/emailAvailability?email='+email,
    {
      headers:{'Content-Type':'application/json'}
    })
    .then(res =>{
      console.log(res);
      console.log(res.data.availability);
      if(res.data.availability === false){
        setError('Email Already Used');
      }else{
        setError('');
      }
      // se(res.data)
    }).catch(ex =>{
      if(ex.response.status === 403){
        sessionStorage.removeItem('accessToken')
        navigate("/login")
      }
      console.log("Not able to access the API")
    })
  }
  

  const handleEdit = (index) => {
    setEditingRowIndex(index);
  };

  const handleDelete = (userId) => {
    deleteUserApi(userId)
    setData(data.filter(user => user.id !== userId))
  };

  const handleSubmit = (index) => {
    setData(data.map(user => {
      if(user.id === index){
        return {...user, userName:editingData.userName,userMobile:editingData.userMobile,userEmail:editingData.userEmail,userRole:editingData.userRole,userPassword:editingData.userPassword}
      }
      return user;
    }));
    setEditingData({...editingData, id:index});
    updateUserApi(editingData);
    handleClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditingData({ ...editingData, [name]: value });
    if(name === 'userEmail'){
      handleEmailAvailability(value);
    }
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    const updatesUser = { ...createData, [name]: value };
    setCreateData(updatesUser);
    if(name === 'userEmail'){
      handleEmailAvailability(value);
    }
  };

  const handleAdd = (newUser) => {
    console.log("New User : ",newUser)
    const newId = Math.max(...data.map(user => user.id)) + 1;
    saveUserApi(newUser);
    const updatedUser = {id: newId, userName:newUser.userName,userMobile:newUser.userMobile,userEmail:newUser.userEmail, shopsCount:0, userRole: newUser.userRole, userPassword: newUser.userPassword};
    setData([...data, updatedUser]);
    setCreateData({ userName: '', userMobile:'', userEmail: '', userRole:'', userPassword:'' });
    handleCreateclose();
  };


return (
  <div>
    <button className="create-button" onClick={handleCreateOpen}>Create New</button>
    {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading...</div>
              </div>
            )}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Mobile</th>
        <th>Email</th>
        <th>Shops</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{row.userName}</td>
          <td>{row.userMobile}</td>
          <td>{row.userEmail}</td>
          <td>{row.shopsCount}</td>
          <td>{row.userRole}</td>
          <td>
          {editingRowIndex === index ? (
                  <>
                    <button onClick={() => handleEdit(null)}>Save</button>
                    <button onClick={() => setEditingRowIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleUpdateClick(row.id)}>Edit</button>
                    <button onClick={() => handleDelete(row.id)}>Delete</button>
                  </>
          )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  {open && (
              <div className="modal-overlay" onClick={handleClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <label className='modal-label'>Name</label>
                <input
                autoFocus
                type='text'
                className='modal-input'
                name='userName'
                value={editingData?.userName}
                onChange={handleChange}></input>
                <label className='modal-label'>Mobile</label>
                <input
                type='text'
                className='modal-input'
                name='userMobile'
                value={editingData.userMobile}
                onChange={handleChange}></input>
                <label className='modal-label'>Email</label>
                <input
                type='text'
                className='modal-input'
                name='userEmail'
                value={editingData.userEmail}
                onChange={handleChange}></input>
                <label className='modal-label'>Role</label>
                <select name="userRole" className='combo-box' value={editingData.userRole} onChange={handleChange}>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
                {/* <input
                type='text'
                className='modal-input'
                name='userRole'
                value={editingData.userRole}
                onChange={handleChange}></input>
                <label className='modal-label'>Password</label> */}
                <input
                    type='password'
                    name='userPassword'
                    className='modal-input'
                    value={editingData.userPassword}
                    onChange={handleChange}
                    required  // This triggers browser's native validation
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button className="modal-button" onClick={ () => handleSubmit(editingData.id)}>Submit</button>
                <button className="modal-button" onClick={handleClose}>Close</button>
                </div>
              </div>
            )}
      {/* Create Modal */}
          {createOpen && (
              <div className="modal-overlay" onClick={handleCreateOpen}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <label className='modal-label'>Name</label>
                <input
                autoFocus
                type='text'
                className='modal-input'
                name='userName'
                value={createData?.userName}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Mobile</label>
                <input
                type='text'
                className='modal-input'
                name='userMobile'
                value={createData.userMobile}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Email</label>
                <input
                type='text'
                className='modal-input'
                name='userEmail'
                value={createData.userEmail}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Role</label>
                <select name="userRole" className='combo-box' value={createData.userRole} onChange={handleCreateChange}>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </select>
                {/* <input
                type='text'
                className='modal-input'
                name='userRole'
                value={createData.userRole}
                onChange={handleCreateChange}></input> */}
                <label className='modal-label'>Password</label>
                <input
                    type='password'
                    name='userPassword'
                    className='modal-input'
                    value={createData.userPassword}
                    onChange={handleCreateChange}
                    required  // This triggers browser's native validation
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button className="modal-button" disabled={!!error} onClick={ () => handleAdd(createData)}>Submit</button>
                <button className="modal-button" onClick={handleCreateclose}>Close</button>
                </div>
              </div>
            )}
  </div>
);
}
