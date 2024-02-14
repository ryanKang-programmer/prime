import './App.css';
import Frame from './Frame/Frame';
import React from 'react';
import Navbar from './ProjectWorkspace/Nav/Navbar';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Amplify from 'aws-amplify';
import LeftNavigation from './Navigation/leftNavigation';
import Container from './Container';

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

document.body.style.top = 0;
document.body.style.position = 'absolute';
document.body.style.width = '100vw';
document.body.style.height = '100vh';
document.body.style.overflow = 'hidden';

function App({signOut, user={name: 'temp'}}) {
  return (
    <div style={{display: 'flex', flexDirection:'row', height: '100vh', width: '100vw'}}>
      {/* Implement directory */}
      {/* <Frame />
      <Navbar /> */}
      <ToastContainer />
      <LeftNavigation style={styles.shadowBox}/>
      <Container style={{flex: 1}}/>
    </div>
  );
}

export default App;

const styles = {
  shadowBox: {
    boxShadow: '0 1px 1px 0 rgba(0, 28, 36, 0.3), 1px 1px 1px 0 rgba(0, 28, 36, 0.15), -1px 1px 1px 0 rgba(0, 28, 36, 0.15)',
    borderTop: '1px solid #eaeded',
    borderRadius: '0px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    minWidth: '280px',
    maxWidth: '280px',
    overflowY: 'scroll',
    zIndex: 999,
  }
}

// export default withAuthenticator(App,{
//   socialProviders: ['google']
// });
