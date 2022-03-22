import React from 'react';
import {GoogleLogout} from 'react-google-login';

const clientId = '149566444629-rajuvt49equu5nbp1rcklgabl3d5o4nd.apps.googleusercontent.com'

function Logout(){
  const onSuccess = (res) => {
    console.log('[Logged out successfully]');
  };


  return(
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  )
}

export default Logout;
