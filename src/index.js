import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppBuilder from './frontend/container';
import getConfig from './config.js';
import { connect, Contract, keyStores, WalletConnection, WalletAccount, Account } from 'near-api-js'
import { initiateDB, initiateAppDB } from './frontend/utils/ThreadDB';

import 'semantic-ui-css/semantic.min.css';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
console.log('nearconfig', nearConfig)

// Initializing contract
async function initContract() {

// Initialize connection to the NEAR testnet
const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

// Initializing Wallet based Account. It can work with NEAR testnet wallet that
// is hosted at https://wallet.testnet.near.org
window.walletConnection = new WalletConnection(near)
console.log('wallet connection', window.walletConnection)

// Getting the Account ID. If still unauthorized, it's just empty string
window.accountId = window.walletConnection.getAccountId()
console.log('window accountId', window.accountId)

window.walletAccount = new WalletAccount(near)
console.log('wallet account', window.walletAccount)
   
if(window.accountId === '') {
    window.acct = new Account(window.walletConnection)
    console.log('window acct', window.acct)
} else {
    window.acct = await near.account(window.accountId)
}
  
// Initializing our contract APIs by contract name and configuration.   
      window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, 
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
        'deleteNewsPostProfile',

        // Comment Management
        'addComment',
        'setCommentData',
        'setCommentDataByAuthor',
        'deleteComment',
        'deleteCommentProfile',

        //Profile Management
        'addProfile',
        'deleteProfile',
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
          'getAllNewsPosts',

          // Comments Views
          'getCommentData',
          'getCommentsByAuthor',
          'getAllComments',

          // Profiles Views
          'getProfileData',
          'getAllProfiles',
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
  ReactDOM.render(<AppBuilder contract={window.contract} wallet={window.walletConnection} account={window.acct} />,
    document.getElementById('root')
  );
}).catch(console.error)