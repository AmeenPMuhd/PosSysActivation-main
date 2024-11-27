// Details.js

import React from 'react';
// import { ShopDetails } from './ShopDetails/ShopDetails';
// import { UserDetails } from './UserDetails/UserDetails';
import { SoftFiles } from './SoftFiles/SoftFiles';
import { ShopsList } from './ShopDetails/ShopsList';
import { UserList } from './UserDetails/UserList';
import { ActivatedShops } from './ActivatedShops/ActivatedShops';

const Details = ({ selectedChatbot }) => {
  return (
    <div>
      {selectedChatbot ==='Shop Details' ? (
        <ShopsList/>
      ) : (
        selectedChatbot ==='User Details' ? (
          <UserList/>
        ) : ( selectedChatbot === 'Shop Systems' ? <ActivatedShops/> : (<SoftFiles/>))
      )}
    </div>
  );
};

export default Details;
