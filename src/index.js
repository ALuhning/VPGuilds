import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppBuilder from './frontend/container';
import getConfig from './config.js';
//import * as nearlib from 'near-api-js';
import { connect, keyStores, WalletConnection, Connection, Account, Contract } from 'near-api-js';
import { initiateDB } from './frontend/utils/ThreadDB';

import 'semantic-ui-css/semantic.min.css';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initializing contract
async function initContract() {
//    window.nearConfig = getConfig(process.env.NODE_ENV || 'development')
//    console.log("nearConfig", window.nearConfig);

    // Initializing connection to the NEAR DevNet and stores keys in local storage with identifier
//    window.near = await nearlib.connect(
//      Object.assign(
//        { 
//          deps: { keyStore: new nearlib.keyStores.BrowserLocalStorageKeyStore(localStorage, "vpguild:") }
//        }, 
//        window.nearConfig
//      )
//    );
const exists = localStorage.getItem('vpguild_wallet_auth_key')
const connection = await new Connection(nearConfig)
console.log('connection', connection)
console.log('keystores', exists)
const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))
//const near = await connect({  keyStore: new keyStores.BrowserLocalStorageKeyStore(), ...nearConfig})
console.log('near', near)

    // Needed to access wallet login
//    window.walletAccount = new nearlib.WalletAccount(window.near);
    window.walletConnection = await new WalletConnection(near, 'vpguild')  
    console.log('window.walletconnection', window.walletConnection)
    // Getting the Account ID. If unauthorized yet, it's just empty string.
   // window.accountId = window.walletAccount.getAccountId();
    window.accountId = window.walletConnection.getAccountId()
    console.log('window.accountID', window.accountId)

    // Initializing our contract APIs by contract name and configuration.
    if(window.accountId === '') {
      window.acct = new Account(window.walletConnection, window.accountId);
      console.log('window.acct no exist', window.acct)
    } else {
     window.acct = await near.account(window.accountId)
      console.log('window accountid', window.accountId)
      console.log('window acct', window.acct)
      console.log('window acct', await window.acct.getAccessKeys())
    }
   // window.publicKey = await window.acct.connection.signer.getPublicKey(window.accountId, 'default')
    
   // console.log('window acct', await window.acct.connection.signer.getPublicKey(window.accountId, 'default'))
console.log('nearconfig', nearConfig)
    //window.contract = new nearlib.Contract(window.acct, window.nearConfig.contractName, 
      window.contract = await near.loadContract(nearConfig.contractName, 
      { 
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: [
        // Setting Identity
        'setIdentity',

        // Member Management
        'setUserRoles',
        'registerUserRole',
        'addMember',
        'changeUserRole',
        'setMemberData',
        'registerMember',
        'addNewMember',

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
          // Member Views
          'getUserRoles',
          'getAllUserRoles',
          'listMembers',
          'getMemberData',
          'getAllMembers',

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
    }
    console.log('window.contract', window.contract)
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(<AppBuilder contract={window.contract} wallet={window.walletConnection} account={window.acct}/>,
    document.getElementById('root')
  );
}).catch(console.error)