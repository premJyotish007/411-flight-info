// AccountInfo.js
import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import './accountInfo.css';
import Cookies from 'js-cookie';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTable from '../utils/DraggableTable';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const saltRounds = 10;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AccountInfo = ({ updateAccountInfo }) => {
  const [view, setView] = useState('info');
  const [showWrongPasswordPrompt, setShowWrongPasswordPrompt] = useState(false);
  const [usedEmailPrompt, setUsedEmailPrompt] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [favoritesData, setFavoritesData] = useState([]);
  const [changesSavedMessageVisible, setChangesSavedMessageVisible] = useState(false);
  



  const fetchDataFavorites = async () => {
    const email = Cookies.get('userEmail');
    try {
      const response = await fetch(`http://localhost:3001/api/get-favorites?email=${email}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          ranking: item.ranking,
          name: `${item.iata_code} - ${item.AIRPORT}, ${item.CITY}, liked since: ${item.timestamp.substring(0, 10)} at ${item.timestamp.substring(11, 20)}`,
        }));
        setFavoritesData(formattedData);
      } else {
        console.error('Invalid data structure:', data);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchDataFavorites();
  }, []); // Fetch favorites on component mount

  console.log(favoritesData);

  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setChangesSavedMessageVisible(false);
  };

  const handleSignInClick = () => {
    setView('signIn');
    setShowWrongPasswordPrompt(false);
  };

  const handleSaveChangesClick = async () => {
    const email = Cookies.get('userEmail');
    const temp = favoritesData.map((item) => ({
      id: item.id,
      ranking: item.ranking,
      iata_code: item.name.split(' - ')[0],
    }));
    const objectListString = JSON.stringify(temp);
    console.log(objectListString);

    try {
      const response = await fetch('http://localhost:3001/updateAccounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, objectList: objectListString }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from server:', data);
      setChangesSavedMessageVisible(true);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  const handleSignOutClick = () => {
    Cookies.remove('userName');
    Cookies.remove('userEmail');
    updateAccountInfo({ name: "null" });
    setShowWrongPasswordPrompt(false);
  };

  const handleDeleteAccountClick = async () => {
    const email = Cookies.get('userEmail');
    console.log(email);
    try {
      const response = await fetch('http://localhost:3001/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
    handleSignOutClick();
  };

  const handleCreateAccountClick = () => {
    setView('createAccount');
    setUsedEmailPrompt(false);
  };

  const hashPassword = async (password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  };

  const handleCreateAccountSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.elements.newName.value;
    const email = event.target.elements.newEmail.value;
    const password = event.target.elements.newPassword.value;

    try {
      const hashedPassword = await hashPassword(password);

      try {
        const get_response = await fetch(`http://localhost:3001/api/get-name?email=${email}`);
        const nameData = await get_response.json();
        if (nameData && nameData.name) {
          setUsedEmailPrompt(true);
          console.log("Email already in use");
          return;
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }

      const response = await fetch('http://localhost:3001/api/add-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, hashedPassword }),
      });
      const data = await response.json();
      Cookies.set('userName', name);
      Cookies.set('userEmail', email);
      updateAccountInfo({ name });
    } catch (error) {
      console.error('Error creating account:', error);
    }
    setView('info');
    setOpen(false);
    fetchDataFavorites(); // Fetch favorites after creating account
  };

  const handleSignInSubmit = async (event) => {
    setShowWrongPasswordPrompt(false);
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    try {
      const response = await fetch(`http://localhost:3001/api/get-password?email=${email}`);
      const data = await response.json();
      const hashedPasswordFromServer = data.password;
      if (!hashedPasswordFromServer) {
        setShowWrongPasswordPrompt(true);
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, hashedPasswordFromServer);
      if (isPasswordMatch) {
        try {
          const nameResponse = await fetch(`http://localhost:3001/api/get-name?email=${email}`);
          const nameData = await nameResponse.json();
          const accountName = nameData.name;

          console.log('Fetched name:', accountName);

          Cookies.set('userName', accountName);
          Cookies.set('userEmail', email);
          updateAccountInfo({
            name: accountName,
          });
          setView('info');
          fetchDataFavorites(); // Fetch favorites after signing in
        } catch (error) {
          console.error('Error fetching name:', error);
        }
      } else {
        setShowWrongPasswordPrompt(true);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
    setOpen(false);
  };

  return (
    <div className="account-info-container">
      {view === 'info' && (
        <div className="account-options">
          {Cookies.get('userName') !== "null" && Cookies.get('userName') !== "undefined" ? (
            <>
              <div className='favorites'>
                <h3> Favorites Airports (Ranked)</h3>
                {
                  favoritesData.length > 0 ?
                    <>
                      <div className='favoritesTable'>
                        <DndProvider backend={HTML5Backend} >
                          <DraggableTable data={favoritesData} onDataUpdate={setFavoritesData} />
                        </DndProvider>
                      </div>
                    </> :
                    <>
                      <p>Like airports to edit your rankings...</p>
                    </>
                }

                <div className="buttons">
                  <button className='saveChangesButton' onClick={handleSaveChangesClick}>
                    Update Rankings!
                  </button>
                  <button className="sign-out-button" onClick={handleSignOutClick}>
                    Sign Out
                  </button>
                  <React.Fragment>
                    <Button variant="contained" onClick={handleClickOpen} >
                      Delete Account
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete your account?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleDeleteAccountClick}>Yes!</Button>
                        <Button onClick={handleClose} autoFocus> No </Button>
                      </DialogActions>
                    </Dialog>
                  </React.Fragment>
                </div>
                {changesSavedMessageVisible && (
                  <div className="changes-saved-message">
                    <Snackbar open={changesSavedMessageVisible} autoHideDuration={3000} onClose={handleClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Changes saved successfully!
                      </Alert>
                    </Snackbar>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="sign-in-button" onClick={handleSignInClick}>
                Sign In
              </button>
              <button className="create-account-button" onClick={handleCreateAccountClick}>
                Create Account
              </button>
            </>
          )}
        </div>
      )}

      {view === 'signIn' && (
        <div className="sign-in-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSignInSubmit}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />

            <label><u><a onClick={() => setView('createAccount')}>Don't have an account?</a></u></label>
            <div className="button-container">
              <button type="submit">Sign In</button>
              <button onClick={() => setView('info')}>Back</button>
            </div>
          </form>
          {showWrongPasswordPrompt && (
            <div className="wrong-password-prompt">
              Incorrect email or password. Please try again.
            </div>
          )}

        </div>
      )}

      {view === 'createAccount' && (
        <div className="create-account-form">
          <h2>Create Account</h2>
          <form onSubmit={handleCreateAccountSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="name" id="newName" name="newName" required />

            <label htmlFor="newEmail">Email:</label>
            <input type="email" id="newEmail" name="newEmail" required />

            <label htmlFor="newPassword">Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />

            <label><u><a onClick={() => setView('signIn')}>Already have an account?</a></u></label>
            <div className="button-container">
              <button type="submit">Create Account</button>
              <button onClick={() => setView('info')}>Back</button>
            </div>
          </form>
          {usedEmailPrompt && (
            <div className="used-email-prompt">
              Looks like this email address is already in use...
            </div>
          )}
          <br />
        </div>
      )}


    </div>
  );
};

export default AccountInfo;