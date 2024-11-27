import React, {useState,useEffect} from 'react'
import './ShopList.css'
import UserApi from '../../Api/UserApi';


export const ShopsList = () => {
  const [loading, setLoading] = useState(true);
  // const [isOpen, setIsOpen] = useState(false);
  // const [actionConfirmed, setActionConfirmed] = useState(false);

  // const handleDailogOpen = () => setIsOpen(true);
  // const handleDailogClose = () => setIsOpen(false);

  // const handleConfirm = (id) => {
  //   // Perform the action here, e.g., deleting an item
  //   handleDelete(id);
  //   console.log("Action confirmed!");
  //   setActionConfirmed(true);
  //   setIsOpen(false);
  // };
    const[data,setData] = useState([
        // { id: 0, shopName: 'John Doe', shopMobile:'8943617935',shopAddress: 'Jedha', shopEmail: 'john@example.com', shopCount: 2 },
        // { id: 1, shopName: 'Sakariya', shopMobile:'8943617923',shopAddress: 'Riyad', shopEmail: 'sakariya@example.com', shopCount: 3 },
        // { id: 2, shopName: 'Fasal', shopMobile:'8943615435',shopAddress: 'Makkah', shopEmail: 'fasal@example.com', shopCount: 4 },
        // { id: 3, shopName: 'Zayan', shopMobile:'9943617935',shopAddress: 'Madeena', shopEmail: 'zayan@example.com', shopCount: 5 }
      ]);
    const [editingData, setEditingData] = useState(null);
    const [createData, setCreateData] = useState({ shopname: '', mobile:'',address: '', shopEmail: '' });
    const [open, setOpen] = React.useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleCreateOpen = () => setCreateOpen(true);
    const handleClose = () => setOpen(false);
    const handleCreateclose = () => setCreateOpen(false);

    useEffect(()=>{
      setLoading(true);
      UserApi.get('api/shop/getAll')
      .then(res =>{
        console.log(res);
        console.log(res.data);
        setData(res.data)
        setLoading(false);
      }).catch(ex =>{
        console.log("Not able to access the API")
        setLoading(false);
      })
    },[])
  
    const saveShopApi = (newShop) =>{
      setLoading(true);
      UserApi.post('api/shop',newShop)
      .then(res =>{
        setLoading(false);
      }).catch(ex =>{
        console.log("Not able to access the API")
        setLoading(false);
      })
    }
  
    const updateShopApi = (updatedShop) => {
      setLoading(true);
      UserApi.patch('api/shop',updatedShop)
      .then(res => {
        console.log("Response : ",res)
        setLoading(false);
      }).catch(ex =>{
        console.log("Not able to access the API")
        setLoading(false);
      })
    }
  
    const deleteShopApi = (shopId) =>{
      setLoading(true);
      UserApi.delete('api/shop?id='+shopId)
      .then(res => {
        console.log("Response : ",res)
        setLoading(false);
      }).catch(ex =>{
        console.log("Not able to access the API")
        setLoading(false);
      })
    }

    const handleUpdateClick = (id) => {
      const shopToUpdate = data.find((shop) => shop.id === id);
      setEditingData({ id, shopName: shopToUpdate.shopName, shopMobile: shopToUpdate.shopMobile, shopAddress: shopToUpdate.shopAddress, shopEmail: shopToUpdate.shopEmail });
      handleOpen();
    };

  
    const handleDelete = (shopId) => {
      setData(data.filter(shop => shop.id !== shopId))
      deleteShopApi(shopId)
    };

    const handleSubmit = (index) => {
      setData(data.map(shop => {
        if(shop.id === index){
          return {...shop, shopName:editingData.shopName,shopMobile:editingData.shopMobile,shopAddress:editingData.shopAddress,shopEmail:editingData.shopEmail}
        }
        return shop;
      }));
      setEditingData({...editingData, id:index})
      updateShopApi(editingData)
      handleClose();
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setEditingData({ ...editingData, [name]: value });
    };

    const handleCreateChange = (event) => {
      const { name, value } = event.target;
      const updatedShop = { ...createData, [name]: value };
      setCreateData(updatedShop);
    };

    const handleAdd = (newShop) => {
      const newId = Math.max(...data.map(shop => shop.id)) + 1;
      saveShopApi(newShop);
      const updatedShop = {id: newId, shopName:newShop.shopName,shopMobile:newShop.shopMobile,shopAddress:newShop.shopAddress,shopEmail:newShop.shopEmail, shopCount:0};
      setData([...data, updatedShop]);
      setCreateData({ shopName: '', shopMobile:'',shopAddress: '', shopEmail: '' });
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
            <th>Address</th>
            <th>System</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{row.shopName}</td>
              <td>{row.shopMobile}</td>
              <td>{row.shopAddress}</td>
              <td>{row.shopCount}</td>
              <td>
                {(
                  <>
                    <button onClick={() => handleUpdateClick(row.id)}>Edit</button>
                    <button onClick={() => handleDelete(row.id)}>Delete</button>
                  </>
                )}
                {/* {isOpen && (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h2>Are you sure?</h2>
              <p>Do you really want to delete this item? This process cannot be undone.</p>
              <button onClick={handleConfirm(row.id)} style={buttonStyle}>Confirm</button>
              <button onClick={handleDailogClose} style={buttonStyle}>Cancel</button>
            </div>
          </div>
      )} */}
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
                name='shopName'
                value={editingData?.shopName}
                onChange={handleChange}></input>
                <label className='modal-label'>Address</label>
                <input
                type='text'
                className='modal-input'
                name='shopAddress'
                value={editingData?.shopAddress}
                onChange={handleChange}></input>
                <label className='modal-label'>Mobile</label>
                <input
                type='text'
                className='modal-input'
                name='shopMobile'
                value={editingData.shopMobile}
                onChange={handleChange}></input>
                <label className='modal-label'>Email</label>
                <input
                type='text'
                className='modal-input'
                name='shopEmail'
                value={editingData.shopEmail}
                onChange={handleChange}></input>
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
                name='shopName'
                value={createData?.shopName}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Address</label>
                <input
                type='text'
                className='modal-input'
                name='shopAddress'
                value={createData?.shopAddress}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Mobile</label>
                <input
                type='text'
                className='modal-input'
                name='shopMobile'
                value={createData.shopMobile}
                onChange={handleCreateChange}></input>
                <label className='modal-label'>Email</label>
                <input
                type='text'
                className='modal-input'
                name='shopEmail'
                value={createData.shopEmail}
                onChange={handleCreateChange}></input>
                <button className="modal-button" onClick={ () => handleAdd(createData)}>Submit</button>
                <button className="modal-button" onClick={handleCreateclose}>Close</button>
                </div>
              </div>
            )}
            

            
      </div>
    );
}

// const overlayStyle = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center'
// };

// const dialogStyle = {
//   backgroundColor: '#fff',
//   padding: '20px',
//   borderRadius: '5px',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '10px'
// };

// const buttonStyle = {
//   padding: '10px 20px',
//   margin: '5px',
//   cursor: 'pointer'
// };
