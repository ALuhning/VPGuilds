import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppBuilder from './frontend/container';
import getConfig from './config.js';
import { connect, keyStores, WalletConnection, Account } from 'near-api-js';
import { initiateDB, initiateAppDB } from './frontend/utils/ThreadDB';

import 'semantic-ui-css/semantic.min.css';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initializing contract
async function initContract() {

const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

console.log('near', near)

    // Needed to access wallet login
//    window.walletAccount = new nearlib.WalletAccount(window.near);
    window.walletConnection = await new WalletConnection(near, 'vpguild')  
    console.log('window.walletconnection', window.walletConnection)
    // Getting the Account ID. If unauthorized yet, it's just empty string.
   
    window.accountId = window.walletConnection.getAccountId()
    

    // Initializing our contract APIs by contract name and configuration.
    if(window.accountId === '') {
      window.acct = new Account(window.walletConnection, window.accountId);
      console.log('window.acct no exist', window.acct)
    } else {
     window.acct = await near.account(window.accountId)
    }
  
console.log('nearconfig', nearConfig)
    
      window.contract = await near.loadContract(nearConfig.contractName, 
      { 
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: [
        // Setting Identity
        'setIdentity',
        'setAppIdentity',

        // Member Management
        'setUserRoles',
        'registerUserRole',
        'addMember',
        'changeUserRole',
        'setMemberData',
        'registerMember',
        'addNewMember',

        // App Management
        'setAppData',
        'registerApp',
        'addNewApp',

        // News Post Management
        'postNewsPost',
        'setNewsPost',
        'setNewsPostsByAuthor',
        'deleteNewsPost',
        'deleteNewsPostProfile'
      ],

        // View methods are read only. They don't modify the state, but usually return some value.
        viewMethods: [
          // Identity
          'getIdentity',
          'getAppIdentity',

          // Member Views
          'getUserRoles',
          'getAllUserRoles',
          'listMembers',
          'getMemberData',
          'getAllMembers',

          // App Views
          'getAppData',

          // News Post Views
          'authorOfNewsPost',
          'getNewsPostsByAuthor',
          'getNewsPost',
          'getSender',
          'getAllNewsPosts'
        ],
       
        // Sender is the account ID to initialize transactions.
        sender: window.accountId
      }
    );

    // initiate database if there is a user (Textile)
    if(window.accountId !== '') {
      await initiateDB()
      await initiateAppDB()
    }
    console.log('window.contract', window.contract)
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(<AppBuilder contract={window.contract} wallet={window.walletConnection} account={window.acct}/>,
    document.getElementById('root')
  );
}).catch(console.error)