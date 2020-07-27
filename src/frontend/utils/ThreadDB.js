import {Libp2pCryptoIdentity} from '@textile/threads-core';
import { ThreadID } from '@textile/threads';
import { Client } from '@textile/hub';
import { encryptSecretBox, decryptSecretBox, parseEncryptionKeyNear } from './Encryption'

const appId = process.env.APPID;
let appDatabase;
let userDatabase;

async function getAppIdentity(appId) {
      const type = 'org';
      /** Restore any cached app identity first */
      const cached = localStorage.getItem(appId + ":" + process.env.THREADDB_APPIDENTITY_STRING)
    
      if (cached !== null) {
      /**Convert the cached app identity string to a Libp2pCryptoIdentity and return */
      return Libp2pCryptoIdentity.fromString(cached)
      }
  
      /** Try and retrieve app identity from contract if it exists */
      if (cached === null) {
              try {
                  let tempIdentity = await Libp2pCryptoIdentity.fromRandom()
  
                  let loginCallback = appLoginWithChallenge(tempIdentity);
                  let db = Client.withUserAuth(loginCallback);
                  let token = await db.getToken(tempIdentity)
  
                  if(token) {
                  /**Get encryption key*/
                  let loginCallback = loginWithChallengeEK(tempIdentity);    
                  let encKey = await Promise.resolve(loginCallback)
                  let encryptionKey = encKey.enckey
                  parseEncryptionKeyNear(appId, type, encryptionKey);
                  let retrieveId = await window.contract.getAppIdentity({appId: appId});
                  console.log('retrieveAppID', retrieveId)
                  let identity = decryptSecretBox(retrieveId.identity);
  
                  localStorage.setItem(appId + ":" + process.env.THREADDB_APPIDENTITY_STRING, identity.toString())
                  localStorage.setItem(appId + ":" + process.env.THREADDB_APP_THREADID, retrieveId.threadId);
                  return await Libp2pCryptoIdentity.fromString(identity); 
                  }
              } catch (err) {
                  console.log(err)
                 
                  /** No cached identity existed, so create a new one */
                  let identity = await Libp2pCryptoIdentity.fromRandom()
                  
                  /** Add the string copy to the cache */
                  localStorage.setItem(appId + ":" + process.env.THREADDB_APPIDENTITY_STRING, identity.toString())
  
                  /**Get encryption key*/
                  let loginCallback = loginWithChallengeEK(identity);    
                  let encKey = await Promise.resolve(loginCallback)
                  let encryptionKey = encKey.enckey 
                  parseEncryptionKeyNear(appId, type, encryptionKey);
                  let encryptedId = encryptSecretBox(identity.toString());
                 
                  const threadId = ThreadID.fromRandom();
                  let stringThreadId = threadId.toString();
                  localStorage.setItem(appId + ":" + process.env.THREADDB_APP_THREADID, stringThreadId);
                  let status = 'active'  
                  await window.contract.setAppIdentity({appId: appId, identity: encryptedId, threadId: stringThreadId, status: status }, process.env.DEFAULT_GAS_VALUE);
  
                  const newIdentity = await window.contract.getAppIdentity({appId: appId});
                  console.log('New App Identity', newIdentity)
                 
                  await window.contract.registerApp({appNumber: newIdentity.appNumber.toString() , appId: appId, appCreatedDate: new Date().getTime().toString(), status: status}, process.env.DEFAULT_GAS_VALUE);
  
                  return Libp2pCryptoIdentity.fromString(identity.toString()); 
              }
      }             
}


async function getIdentity(accountId) {
    const type = 'member'
    /** Restore any cached user identity first */
    const cached = localStorage.getItem(appId + ":" + process.env.THREADDB_IDENTITY_STRING)
    console.log('cached', cached)
    if (cached !== null) {
    /**Convert the cached identity string to a Libp2pCryptoIdentity and return */
    return Libp2pCryptoIdentity.fromString(cached)
    }

    /** Try and retrieve identity from contract if it exists */
    if (cached === null) {
            try {
                let tempIdentity = await Libp2pCryptoIdentity.fromRandom()
                console.log('tempidentity', tempIdentity)
                const loginCallback = loginWithChallenge(tempIdentity);
                const db = Client.withUserAuth(loginCallback);
                console.log('db', db)
                const token = await db.getToken(tempIdentity)
                console.log('tempid', token)
                if(token) {
                /**Get encryption key*/
                let loginCallback = loginWithChallengeEK(tempIdentity);    
                let encKey = await Promise.resolve(loginCallback)
                let encryptionKey = encKey.enckey
                parseEncryptionKeyNear(accountId, type, encryptionKey);
                let retrieveId = await window.contract.getIdentity({account: accountId});
                console.log('retrieveID', retrieveId)
                let identity = decryptSecretBox(retrieveId.identity);

                localStorage.setItem(appId + ":" + process.env.THREADDB_IDENTITY_STRING, identity.toString())
                localStorage.setItem(appId + ":" + process.env.THREADDB_USER_THREADID, retrieveId.threadId);
                return await Libp2pCryptoIdentity.fromString(identity); 
                }
            } catch (err) {
                console.log(err)
               
                /** No cached identity existed, so create a new one */
                let identity = await Libp2pCryptoIdentity.fromRandom()
                
                /** Add the string copy to the cache */
                localStorage.setItem(appId + ":" + process.env.THREADDB_IDENTITY_STRING, identity.toString())

                /**Get encryption key*/
                let loginCallback = loginWithChallengeEK(identity);    
                let encKey = await Promise.resolve(loginCallback)
                let encryptionKey = encKey.enckey 
                parseEncryptionKeyNear(accountId, type, encryptionKey);
                let encryptedId = encryptSecretBox(identity.toString());
               
                const threadId = ThreadID.fromRandom();
                let stringThreadId = threadId.toString();
                localStorage.setItem(appId + ":" + process.env.THREADDB_USER_THREADID, stringThreadId);
                let status = 'active'
                await window.contract.setIdentity({account: accountId, identity: encryptedId, threadId: stringThreadId, status: status }, process.env.DEFAULT_GAS_VALUE);

                const newIdentity = await window.contract.getIdentity({account: accountId});
                console.log('New Identity', newIdentity)

                await window.contract.registerMember({memberId: newIdentity.memberId.toString() , memberAccount: window.accountId, memberRole: 'member', memberJoinDate: new Date().getTime().toString(), status: status}, process.env.DEFAULT_GAS_VALUE);

                return Libp2pCryptoIdentity.fromString(identity.toString()); 
            }
    }             
}

async function getAppThreadId(appId) {

  /** Restore any cached user identity first */
  const cached = localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)
  
  if (cached !== null) {
      return cached
  }

  /** Try and retrieve from contract if it exists */
  if (cached === null) {
          try {
              let retrieveId = await window.contract.getAppIdentity({threadId: appId});
              console.log('retrieve AppIdthread', retrieveId)
              let identity = decryptSecretBox(retrieveId);
              console.log('retrieved appthreadId decrypted', identity.threadId)
              return identity.threadId; 
          } catch (err) {
             console.log(err);
          }
  }             
}


async function getThreadId(accountId) {

    /** Restore any cached user identity first */
    const cached = localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)
    
    if (cached !== null) {
        return cached
    }

    /** Try and retrieve from contract if it exists */
    if (cached === null) {
            try {
                let retrieveId = await window.contract.getIdentity({threadId: accountId});
                console.log('retrieveIdthread', retrieveId)
                let identity = decryptSecretBox(retrieveId);
                console.log('retrieved threadId decrypted', identity.threadId)
                return identity.threadId; 
            } catch (err) {
               console.log(err);
            }
    }             
}
const loginWithChallengeEK = (identity) => {
    // we pass identity into the function returning function to make it
    // available later in the callback
      return new Promise((resolve, reject) => {
        /** 
         * Configured for our development server
         * 
         * Note: this should be upgraded to wss for production environments.
         */
        const socketUrl = `wss://vpai.azurewebsites.net:443/ws/enckey`
        
        /** Initialize our websocket connection */
        const socket = new WebSocket(socketUrl)
  
        /** Wait for our socket to open successfully */
        socket.onopen = () => {
          /** Get public key string */
          const publicKey = identity.public.toString();

          socket.send(JSON.stringify({
              pubkey: publicKey,
              type: 'enckey'
          }));
  
          /** Listen for messages from the server */
          socket.onmessage = async (event) => {
             
            const data = JSON.parse(event.data)
            switch (data.type) {
              /** Error never happen :) */
              case 'error': {
                reject(data.value);
                break;
              }
            
              /** Enc Key Received */
              case 'enckey': {
                  resolve(data.value)
                  break;
              }
             
            }
          }
        }
        
      });

  }

const loginWithChallenge = (identity) => {
    // we pass identity into the function returning function to make it
    // available later in the callback
    return () => {
      return new Promise((resolve, reject) => {
        /** 
         * Configured for our development server
         * 
         * Note: this should be upgraded to wss for production environments.
         */
       
        const socketUrl = `wss://vpai.azurewebsites.net:443/ws/userauth`
        
        /** Initialize our websocket connection */
        const socket = new WebSocket(socketUrl)
  
        /** Wait for our socket to open successfully */
        socket.onopen = () => {
          /** Get public key string */
          const publicKey = identity.public.toString();
          console.log('publickey', publicKey)
          /** Send a new token request */
          socket.send(JSON.stringify({
            pubkey: publicKey,
            type: 'token'
          })); 
  
          /** Listen for messages from the server */
          socket.onmessage = async (event) => {
            const data = JSON.parse(event.data)
            console.log('data', data)
            switch (data.type) {
              /** Error never happen :) */
              case 'error': {
                reject(data.value);
                break;
              }
              /** The server issued a new challenge */
              case 'challenge':{
                /** Convert the challenge json to a Buffer */
                const buf = Buffer.from(data.value)
                /** User our identity to sign the challenge */
                const signed = await identity.sign(buf)
                /** Send the signed challenge back to the server */
                socket.send(JSON.stringify({
                  type: 'challenge',
                  sig: Buffer.from(signed).toJSON()
                })); 
                break;
              }
              /** New token generated */
              case 'token': {
                resolve(data.value)
                break;
              }
              
            }
       
          }
          
        }
        
      })
    }
  }

  const appLoginWithChallenge = (identity) => {
    // we pass identity into the function returning function to make it
    // available later in the callback
    return () => {
      return new Promise((resolve, reject) => {
        /** 
         * Configured for our development server
         * 
         * Note: this should be upgraded to wss for production environments.
         */
       
        const socketUrl = `wss://vpai.azurewebsites.net:443/ws/appauth`
        
        
        /** Initialize our websocket connection */
        const socket = new WebSocket(socketUrl)
  
        /** Wait for our socket to open successfully */
        socket.onopen = () => {
          /** Get public key string */
          const publicKey = identity.public.toString();
  
          /** Send a new token request */
          socket.send(JSON.stringify({
            pubkey: publicKey,
            type: 'token'
          })); 
  
          /** Listen for messages from the server */
          socket.onmessage = async (event) => {
            const data = JSON.parse(event.data)
            switch (data.type) {
              /** Error never happen :) */
              case 'error': {
                reject(data.value);
                break;
              }
              /** The server issued a new challenge */
              case 'challenge':{
                /** Convert the challenge json to a Buffer */
                const buf = Buffer.from(data.value)
                /** User our identity to sign the challenge */
                const signed = await identity.sign(buf)
                /** Send the signed challenge back to the server */
                socket.send(JSON.stringify({
                  type: 'challenge',
                  sig: Buffer.from(signed).toJSON()
                })); 
                break;
              }
              /** New token generated */
              case 'token': {
                resolve(data.value)
                break;
              }
       
            }
          }
        
        }
      });
    }
  }

  export async function initiateAppDB() {
    let type = 'app';
    const identity = await getAppIdentity(appId);
    console.log('app identity', identity)
    const threadId = await getAppThreadId(appId);
    const appdb = await tokenWakeUp(type)
 
    console.log('Verified App on Textile API');
    console.log('new app client', appdb);
    await appdb.getToken(identity)
    appDatabase = appdb;
  //  const token = await db.getToken(identity)

  //  const cachedToken = localStorage.getItem(appId + ":" + process.env.THREADDB_APPTOKEN_STRING)

  //  if(!cachedToken || cachedToken !== token) {
  //      localStorage.removeItem(appId + ":" + process.env.THREADDB_APPTOKEN_STRING)
  //      localStorage.setItem(appId + ":" + process.env.THREADDB_APPTOKEN_STRING, token)
  //  }
  
    console.log(JSON.stringify(appdb.context.toJSON()))
    try {
        await appdb.getDBInfo(ThreadID.fromString(threadId))
        appDbObj = {
            db: appdb,
            threadId: threadId,
  //          token: token
        }
    } catch (err) {
        await appdb.newDB(ThreadID.fromString(threadId));
        console.log('app DB created');
        appDbObj = {
            db: appdb,
            threadId: threadId,
  //          token: token
        }
    }
    return appDbObj
}

 

export async function initiateDB() {
    let type = 'member';
    const identity = await getIdentity(window.accountId);
    console.log('identity', identity)
    const threadId = await getThreadId(window.accountId);
    const db = await tokenWakeUp(type)
    await db.getToken(identity)
    userDatabase = db
    console.log('Verified on Textile API');
    console.log('db', db)
   
    try {
        await db.getDBInfo(ThreadID.fromString(threadId))
        dbObj = {
            db: db,
            threadId: threadId
        }
    } catch (err) {
        await db.newDB(ThreadID.fromString(threadId));
        console.log('DB created');
        dbObj = {
            db: db,
            threadId: threadId
        }
    }
    return dbObj
}


export async function initiateAppCollection(collection, schema) {
 // let type = 'app'
 // const db = await tokenWakeUp(type)
  
  try {
      const r = await appDatabase.find(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, {})
      console.log('r :', r)
      console.log('found :', r.instancesList.length)    
      return r
  } catch (err) {
      console.log(err);
      await appDatabase.newCollection(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, schema);
      console.log('New collection created', collection);
  }
}


export async function initiateCollection(collection, schema) {
//  let type = 'member'
//  const db = await tokenWakeUp(type)

    try {
        const r = await userDatabase.find(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, {})
        console.log('r :', r)
        console.log('found :', r.instancesList.length)    
        return r
    } catch (err) {
        console.log(err);
        await userDatabase.newCollection(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, schema);
        console.log('New collection created', collection);
    }
}


export async function dataURItoBlob(dataURI)
{
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;

    if(dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for(var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
}

export async function tokenWakeUp(type) {
  /** Use the identity to request a new API token when needed */
  console.log('type', type)
  if (type === 'member') {
    const identity = await getIdentity(window.accountId);
    const loginCallback = loginWithChallenge(identity, type);
    const db = Client.withUserAuth(loginCallback);
    return db
  } else if (type ==='app' ) {
    const identity = await getAppIdentity(appId)
    const loginCallback = appLoginWithChallenge(identity, type);
    const db = Client.withUserAuth(loginCallback);
    return db
  }
}

export async function retrieveAppRecord(id, collection) {
//  let type = 'app'
//  const db = await tokenWakeUp(type)
  
  let obj
  try {
      let r = await appDatabase.findByID(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, id)
      console.log('record retrieved', r.instance);
      obj = r.instance
  } catch (err) {
      console.log('error', err)
      console.log('id does not exist')
  }
  return obj
}

export async function retrieveAppRecords(records, appdb, collection) {

  ////currently NOT USED

//   let type = 'app'
//   const db = await tokenWakeUp(type)
 
   let obj = []
   try {
    if (records.length > 0) {
      records.map(post => {
         console.log('news records map', post)
         console.log('post[0]', post[0])
         if(post[0]!=='' && post[3]!=='false') {
            let r = appdb.findByID(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, post[0])
            r.then((result) => {
              console.log('record retrieved', result.instance);
              obj.push([
                result.instance._id,
                result.instance.title
              ]
              )
            })
         }
      })
    }    
   } catch (err) {
       console.log('error', err)
       console.log('id does not exist')
   }
   console.log('object here', obj)
   return obj
 }

export async function retrieveRecord(id, collection) {
//    let type = 'member'
//    const db = await tokenWakeUp(type)

    let obj
    try {
        let r = await userDatabase.findByID(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, id)
        console.log('record retrieved', r.instance);
        obj = r.instance
    } catch (err) {
        console.log('error', err)
        console.log('id does not exist')
    }
    return obj
}

export async function createAppRecord(collection, record) {
//    let type = 'app'
//    const db = await tokenWakeUp(type)

  try {
     await appDatabase.create(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, [record])        
     console.log('success app record created')
  } catch (err) {
      console.log('error', err)
      console.log('there was a problem, app record not created')
  }
}

export async function createRecord(collection, record) {
//  let type = 'member'
//  const db = await tokenWakeUp(type)

    try {
       await userDatabase.create(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, [record])        
       console.log('success record created')
    } catch (err) {
        console.log('error', err)
        console.log('there was a problem, record not created')
    }
}

export async function updateAppRecord(collection, record) {
  
    try {
       await appDatabase.save(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, [record])        
       console.log('success app record updated')
    } catch (err) {
        console.log('error', err)
        console.log('there was a problem, app record not updated')
    }
  }
  
  export async function updateRecord(collection, record) {
  
      try {
         await userDatabase.save(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, [record])        
         console.log('success record updated')
      } catch (err) {
          console.log('error', err)
          console.log('there was a problem, record not updated')
      }
  }

  export async function hasAppRecord(collection, id) {
  
    try {
       await appDatabase.has(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, [id])        
       console.log('success app record found')
       return true
    } catch (err) {
        console.log('error', err)
        console.log('there was a problem, app record not found')
        return false
    }
  }
  
  export async function hasRecord(collection, id) {
  
      try {
        console.log('id to find', id)
         await userDatabase.has(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, [id])        
         console.log('success record found')
         return true
      } catch (err) {
          console.log('error', err)
          console.log('there was a problem, record not found')
          return false
      }
  }

export async function deleteAppRecord(id, collection) {
//  let type = 'app'
//  const db = await tokenWakeUp(type)

  try {
      await appDatabase.delete(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_APP_THREADID)), collection, [id])
      console.log('app record deleted')
  } catch (err) {
      console.log('error', err)
      console.log('there was an error deleting the app record')
  }
}


export async function deleteRecord(id, collection) {
 // let type = 'member'
 // const db = await tokenWakeUp(type)

    try {
        await userDatabase.delete(ThreadID.fromString(localStorage.getItem(appId + ":" + process.env.THREADDB_USER_THREADID)), collection, [id])
        console.log('record deleted')
    } catch (err) {
        console.log('error', err)
        console.log('there was an error deleting the record')
    }
}