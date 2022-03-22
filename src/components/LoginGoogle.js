import React from 'react';
import {GoogleLogin} from 'react-google-login';

const clientId = '149566444629-rajuvt49equu5nbp1rcklgabl3d5o4nd.apps.googleusercontent.com'

function Login(){
  const onSuccess = (res) => {
    console.log('[Login Success] currentUser:', res.profileObj);
  };

  const onFailure = (res) => {
    console.log('[Login Failed] res:', res);
  };

  return(
    <div>
    <br/><br/><br/><br/>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{marginTop: '100px'}}
        isSignedIn={true}
      />
    </div>
  )
}

export default Login;
