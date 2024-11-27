import React, {useEffect, useState} from 'react'
import './ActivatedShops.css'
import UserApi from '../../Api/UserApi';

export const ActivatedShops = () => {

  const [loading, setLoading] = useState(true);
    // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCreateclose = () => setCreateOpen(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [noOfMonths, setNoOfMonths] = useState(1);



  // Function to handle changes in the dropdown selection
  const handleSelectChange = (event) => {
    console.log("Value : ",event.target.value)
    setSelectedOption(event.target.value);
  };


  const[initialData,setInitialData] = useState([
    // { id: 1, shopName: 'Calicut Cafteria', userName:'Ashik',systemName: 'TestName', createdAt: '23-03-2024', currentStatus:'ACTIVATED',  },
    // { id: 2, shopName: 'Dubai Pardha', userName:'Abdu', systemName: 'Test Name 2', createdAt: '24-03-2024', currentStatus:'PENDING',  },
    // { id: 3, shopName: 'New Look', userName:'Sidheeq', systemName: 'Test Name 3', createdAt: '13-03-2024', currentStatus:'TRIAL ACTIVATED',  },
    // { id: 4, shopName: 'Broast King', userName:'Rahul', systemName: 'Test Name 4', createdAt: '03-03-2024', currentStatus:'DEACTIVATEDS',  },
  ]);
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  // const [editingRowIndex, setEditingRowIndex] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(()=>{
    setLoading(true)
    UserApi.get('api/system/getAll')
    .then(res =>{
      setInitialData(res.data)
      setData(res.data)
      setLoading(false)
    }).catch(ex =>{
      console.log("Not able to access the API")
      setLoading(false)
    })
  },[])

  const activateApi = (id,months) => {
    setLoading(true);
    UserApi.patch('api/system/activate-system?id='+id+'&noOfMonths='+months)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      console.log("Not able to access the API")
      setLoading(false);
    })
  }

  const trialKeyApi = (id) => {
    setLoading(true);
    UserApi.get('api/system/show-trial_key?id='+id)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      console.log("Not able to access the API");
      setLoading(false);
    })
  }

  const activationKeyApi = (id) => {
    setLoading(true);
    UserApi.get('api/system/show-activation_key?id='+id)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      console.log("Not able to access the API")
      setLoading(false);
    })
  }

  const activateTrialApi = (id, months) => {
    setLoading(true);
    UserApi.patch('api/system/activate-trial?id='+id+'&noOfMonths='+months)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      console.log("Not able to access the API")
      setLoading(false);
    })
  }

  const deActivateApi = (id) => {
    setLoading(true);
    UserApi.patch('api/system/deactivate-system?id='+id)
    .then(res => {
      console.log("Response : ",res)
      setLoading(false);
    }).catch(ex =>{
      console.log("Not able to access the API")
      setLoading(false);
    })
  }
  

  const handleActivationClick = (id, actionType) => {
    var type = "";
    if(actionType === "ACTIVATE"){
      var noOfMonths = prompt("Months")
      if(noOfMonths === null || noOfMonths === ""){
        
      }else{
        setNoOfMonths(noOfMonths);
        activateApi(id, noOfMonths);
        type = "ACTIVATED";
        setData(data.map(user => {
          if(user.id === id){
            return {...user, currentStatus: type}
          }
          return user;
        }));
      }
    }else if(actionType === "DEACTIVATE"){
      deActivateApi(id);
      type = "DEACTIVATED";
      
    }else if(actionType === "ACTIVATE_TRIAL"){
      var noOfMonths = prompt("Months")
      if(noOfMonths === null || noOfMonths === ""){
        
      }else{
        setNoOfMonths(noOfMonths);
        activateTrialApi(id, noOfMonths);
        type = "TRIAL ACTIVATED";
        setData(data.map(user => {
          if(user.id === id){
            return {...user, currentStatus: type}
          }
          return user;
        }));
      }
      
    }
    
    // setEditingData({ id, userName: systemToUpdate.userName, userMobile: systemToUpdate.userMobile, userEmail: systemToUpdate.userEmail, userRole: systemToUpdate.userRole });
    // handleOpen();
  };

  const handleShowKeys = (id, actionType) => {
    if(actionType === "SHOW_TRIAL_KEY"){
      trialKeyApi(id);
    }else if(actionType === "SHOW_KEY"){
      activationKeyApi(id);
    }
  }

  const handleAdd = (newShop) => {
    
  };
  useEffect(() => {
    if(searchTerm !== ''){
      const filteredData = initialData.filter(item =>
        selectedOption === 'Shop' ? item.shopName.toLowerCase().includes(searchTerm.toLowerCase()) : item.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setData(filteredData);
    }else{
      setData(initialData);
    }
  },[searchTerm,initialData]);

  const handleCreateChange = (event) => {
    const { value } = event.target;
    setNoOfMonths(value);
  };

    return(
        <div>
            <div style={{textAlign:'left',paddingLeft:10,paddingTop:6, marginBottom:20, height:50, width:'100%', borderRadius:10, backgroundColor:'white',boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)'}}>
            <select id="dropdown" value={selectedOption} onChange={handleSelectChange} className='custom-select'>
                <option value="">Select an option</option>
                <option value="Shop">Shop</option>
                <option value="User">User</option>
            </select>
            <input
            type='text'
            className='custom-text'
            value={searchTerm}
            onChange={handleSearch}></input>
            <input
            type='submit'
            className='custom-button'></input>
            </div>
            <div>
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
        <th>Shop</th>
        <th>User</th>
        <th>System</th>
        <th>Created At</th>
        <th>Current Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{index}</td>
          <td>{row.shopName}</td>
          <td>{row.userName}</td>
          <td>{row.systemName}</td>
          <td>{row.createdAt}</td>
          <td>{row.currentStatus}</td>
          <td>{
            row.currentStatus === 'NOT ACTIVATED'? (
              <div>
              <button onClick={() => handleActivationClick(row.id,"ACTIVATE_TRIAL")}>Activate Trial</button>
              <button onClick={() => handleActivationClick(row.id, "ACTIVATE")}>Activate</button>
            </div>
            ):
            row.currentStatus === 'TRIAL ACTIVATED'?(
              <div>
              <button onClick={() => handleShowKeys(row.id, "SHOW_TRIAL_KEY")}>Show Key</button>
              <button onClick={() => handleActivationClick(row.id, "ACTIVATE")}>Activate</button>
              <button onClick={() => handleActivationClick(row.id, "DEACTIVATE")}>Deactivate</button>
            </div>
            ):
            row.currentStatus === 'DEACTIVATED'?(
              <div>
              <button onClick={() => handleActivationClick(row.id, "ACTIVATE")}>Activate</button>
            </div>
          ):(
            <div>
            <button onClick={() => handleShowKeys(row.id, "SHOW_KEY")}>Show Key</button>
            <button onClick={() => handleActivationClick(row.id, "DEACTIVATE")}>Deactivate</button>
          </div>
        )
            }</td>
        </tr>
      ))}
      {open && (
              <div className="modal-overlay" onClick={handleOpen}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <label className='modal-label'>No.of Months</label>
                <input
                autoFocus
                type='text'
                className='modal-input'
                name='noOfMonths'
                value={noOfMonths}
                datatype='integer'
                onChange={handleCreateChange}></input>
                <button className="modal-button" onClick={ () => handleAdd()}>Submit</button>
                <button className="modal-button" onClick={handleCreateclose}>Close</button>
                </div>
              </div>
            )}
            
    </tbody>
  </table>
  </div>
        </div>
    )
}