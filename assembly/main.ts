import {
  env,
  context,
  storage,
  logging, 
  PersistentVector, 
  PersistentMap } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math

import {  UserIdentity, Member, MemberMetaData,
          UserRole, UserRoleMetaData,
          AppIdentity,
          NewsPost, NewsPostArray, NewsPostMetaData, MembersArray } from "./model";

// Collections where we store data
// store user identity
let userIdentity = new PersistentMap<string, UserIdentity>("userIdentity");

// store app identities
let appIdentity = new PersistentMap<string, AppIdentity>("appIdentity");
let apps = new PersistentVector<string>("apps");

// store all unique news posts
let newsPosts = new PersistentVector<string>("news");
let newsPostMeta = new PersistentMap<string, NewsPostMetaData>("newsdata");

// store all news posts of a particular author
let indivNewsPosts = new PersistentMap<string, NewsPost>("indivnews");
let newsPostsByAuthor = new PersistentMap<string, NewsPostMetaData>("newsByAuthor");

// user role storage
let userRoleList = new PersistentVector<UserRoleMetaData>("role");
let users = new PersistentVector<string>("users")
let userRoles = new PersistentMap<string, UserRoleMetaData>("userRoles");

let members = new PersistentVector<string>("members");
let memberProfile = new PersistentMap<string, MemberMetaData>("memberdata");

// member Id counter
function _incrementCounter(value: u32): void {
  const newCounter = storage.getPrimitive<u32>("memberId", 0) + value;
  storage.set<u32>("memberId", newCounter);
  logging.log("Current Member Id is now: " + newCounter.toString());
}

function _getMemberId(): u32 {
  return storage.getPrimitive<u32>("memberId", 0);
}

// ThreadDB identity functions
// Create new identity for User threadsDB
export function setIdentity(account: string, encryptedId: string, threadId: string, status: string): void {
  let present = false;
  logging.log('members vector');
  logging.log(members);
    for(let i: i32 = 0; i < members.length; i++){
      if (members[i] == account) {
        present = true;
        break;
      }
    }
    if (!present) {
      let thisMemberId = members.length + 1;
      let newId = new UserIdentity();
      newId.account = account;
      newId.identity = encryptedId;
      newId.threadId = threadId;
      newId.memberId = thisMemberId;
      newId.status = status;
      userIdentity.set(context.sender, newId);
    } else {
      logging.log('member already has an identity set');
    }
}

export function getIdentity(account: string): UserIdentity {
  let identity = userIdentity.getSome(account);
  logging.log('getting identity');
  logging.log(identity);
  return identity;
}

// Create new Identity for App ThreadsDB
export function setAppIdentity(appId: string, encryptedId: string, threadId: string, status: string): void {
  let present = false;
  logging.log('apps vector');
  logging.log(apps);
    for(let i: i32 = 0; i < apps.length; i++){
      if (apps[i] == appId) {
        present = true;
        break;
      }
    }
    if (!present) {
      let thisAppNumber = apps.length + 1;
      let newAppIdentity = new AppIdentity();
      newAppIdentity.appId = appId;
      newAppIdentity.identity = encryptedId;
      newAppIdentity.threadId = threadId;
      newAppIdentity.appNumber = thisAppNumber;
      newAppIdentity.status = status;
      appIdentity.set(context.sender, newAppIdentity);
    } else {
      logging.log('app already has an identity set');
    }
}

export function getAppIdentity(appId: string): AppIdentity {
  let identity = appIdentity.getSome(appId);
  logging.log('getting app identity');
  logging.log(identity);
  return identity;
}

// User Role Management

export function getUserRoles(user: string): Array<string> {
  let roleId = userRoles.get(user);
  if(!roleId) {
    return new Array<string>();
  }
  let role = roleId.memberlog;
  return role;
}

export function getMemberData(memberId: string): Array<string> {
  let member = memberProfile.get(memberId);
  logging.log('getting member data')
  logging.log(member)
  if(!member) {
    return new Array<string>();
  }
  let memberData = member.memberlog;
  return memberData;
}

export function getAllMembers(): MembersArray {
  logging.log('retrieving members');
  let _memberList = new Array<string[]>();
  logging.log(members);
  for(let i: i32 = 0; i < members.length; i++) {
    let _member = getMemberData(members[i]);
    logging.log(_member)
    _memberList.push(_member);
  }
  let ml = new MembersArray();
  ml.members = _memberList;
  ml.len = _memberList.length;
  logging.log(ml)
  return ml;
}

export function getAllUserRoles(): Array<UserRoleMetaData> {
  let users = new Array<UserRoleMetaData>();
  logging.log(users);
  for (let i: i32 = 0; i < userRoleList.length; i++) {
    users.push(userRoleList[i]);
  }
  return users;
}

export function setUserRoles(role: UserRole): void {
  let _userId = getUserRoles(role.user);
  if(_userId == null) {
    _userId = new Array<string>();
    _userId.push(role.role);
  }
  let jo = new UserRoleMetaData();
  jo.memberlog = _userId;
  userRoles.set(role.user, jo);
  logging.log(role.user);
  logging.log(jo);
}

export function setMemberData(member: Member): void {
  let _memberId = getMemberData(member.memberId);
  logging.log('setting member data')
  logging.log(_memberId)
  if(_memberId == null) {
    _memberId = new Array<string>();
    _memberId.push(member.memberId); 
    _memberId.push(member.memberAccount);
    _memberId.push(member.memberRole);
    _memberId.push(member.memberJoinDate);
    _memberId.push(member.status);
    logging.log(_memberId)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _memberId.length; i++){
      if (_memberId[0] == member.memberId) {
        present = true;
        break;
      }
    }
    if (!present) {
    _memberId.push(member.memberId);
    _memberId.push(member.memberAccount);
    _memberId.push(member.memberRole);
    _memberId.push(member.memberJoinDate);
    _memberId.push(member.status);
    }
  }
  let memberData = new MemberMetaData();
  memberData.memberlog = _memberId;
  memberProfile.set(member.memberId, memberData);
  logging.log(memberProfile);
  logging.log(member.memberId);
  logging.log(memberData);
}

export function addMember(user: string): void {
  let present = false;
  for(let i: i32 = 0; i < users.length; i++) {
    if (users[i] == user) {
      present = true;
    }
  }
  if (!present) {
    users.push(user);
  }
}

function _addNewMember(memberId: string): void {
  let present = false;
  for(let i: i32 = 0; i < members.length; i++) {
    if (members[i] == memberId) {
      present = true;
    }
  }
  if (!present) {
    members.push(memberId);
  }
}

export function listMembers(): Array<string> {
  let members = new Array<string>();
for (let i: i32 = 0; i<users.length; i++) {
  members.push(users[i]);
}
  return members;
}

export function changeUserRole(user: string, role: string): void {
  if(context.sender == 'guildleader.testnet') {
    logging.log('deleting old user')
    userRoles.delete(user)
    logging.log('registering new user/role')
    _registerUserRole(user, role);
  } else {
    logging.log("unauthorized function call");
  }
}

// Log user roles

export function registerUserRole(
  user: string,
  role: string
  ): UserRole {
  logging.log("registering user role");
  return _registerUserRole(
    user,
    role
  );
  }
  
  function _registerUserRole(
    user: string,
    role: string
  ): UserRole {
    logging.log("start registering user role");
    let userRole = new UserRole();
    userRole.user = user;
    userRole.role = role;
    setUserRoles(userRole);
    logging.log("registered new user role");
    return userRole;
  }

// Log user roles

export function registerMember(
  memberId: string,
  memberAccount: string,
  memberRole: string,
  memberJoinDate: string,
  status: string
  ): Member {
  logging.log("registering member");
  return _registerMember(
    memberId,
    memberAccount,
    memberRole,
    memberJoinDate,
    status
  );
  }
  
  function _registerMember(
    memberId: string,
    memberAccount: string,
    memberRole: string,
    memberJoinDate: string,
    status: string
  ): Member {
    logging.log("start registering new member");
    let member = new Member();
    member.memberId = memberId;
    member.memberAccount = memberAccount;
    member.memberRole = memberRole;
    member.memberJoinDate = memberJoinDate;
    member.status = status;
    setMemberData(member);
    _addNewMember(memberId);
    logging.log("registered new member");
    return member;
  }


// Methods for author
export function authorOfNewsPost(tokenId: string): string {
  let post = getNewsPost(tokenId);
  let author = post.newsPostAuthor;
  return author;
}


export function getAllNewsPosts(): NewsPostArray {
  logging.log('retrieving news posts');
  let _newsPostList = new Array<string[]>();
  logging.log(newsPosts);
  for(let i: i32 = 0; i < newsPosts.length; i++) {
    let _newsPost = getNewsPostData(newsPosts[i]);
    logging.log(_newsPost)
    _newsPostList.push(_newsPost);
  }
  let nl = new NewsPostArray();
  nl.newsPosts = _newsPostList;
  nl.len = _newsPostList.length;
  logging.log(nl)
  return nl;
}

export function getNewsPostData(newsPostId: string): Array<string> {
  let newsPost = newsPostMeta.get(newsPostId);
  logging.log('getting news post data')
  logging.log(newsPost)
  if(!newsPost) {
    return new Array<string>();
  }
  let newsPostData = newsPost.newsPostsData;
  return newsPostData;
}

export function getNewsPostsByAuthor(author: string): Array<string> {
  let postId = newsPostsByAuthor.get(author);
  if(!postId) {
    return new Array<string>();
  }
  let id = postId.newsPostsData;
  return id;
}

// Methods for Consolidated News Posts

export function setNewsPostsByAuthor(post: NewsPost): void {
  let _postId = getNewsPostsByAuthor(post.newsPostAuthor);
  if(_postId == null) {
    _postId = new Array<string>();
    _postId.push(post.newsPostId);
  } else {
    _postId.push(post.newsPostId);
  }
  let nd = new NewsPostMetaData();
  nd.newsPostsData = _postId;
  newsPostsByAuthor.set(post.newsPostAuthor, nd);
}

export function setNewsPostData(post: NewsPost): void {
  let _postId = getNewsPostData(post.newsPostId);
  logging.log('setting news post data')
  logging.log(_postId)
  if(_postId == null) {
    _postId = new Array<string>();
    _postId.push(post.newsPostId); 
    _postId.push(post.newsPostAuthor);
    _postId.push(post.newsVerificationHash);
    logging.log(_postId)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _postId.length; i++){
      if (_postId[0] == post.newsPostId) {
        present = true;
        break;
      }
    }
    if (!present) {
    _postId.push(post.newsPostId);
    _postId.push(post.newsPostAuthor);
    _postId.push(post.newsVerificationHash);
    }
  }
  let newsPostData = new NewsPostMetaData();
  newsPostData.newsPostsData = _postId;
  newsPostMeta.set(post.newsPostId, newsPostData);
  logging.log(newsPostMeta);
  logging.log(post.newsPostId);
  logging.log(newsPostData);
}

// Methods for Individual News Posts

export function getNewsPost(tokenId: string): NewsPost {
  let post = indivNewsPosts.getSome(tokenId);
  return post;
}

export function setNewsPost(post: NewsPost): void {
  indivNewsPosts.set(post.newsPostId, post);
}

export function getSender(): string {
  return context.sender;
}

export function deleteNewsPost(tokenId: string): void {
  indivNewsPosts.delete(tokenId);
}

export function deleteNewsPostProfile(tokenId: string): Array<string> {
  let post = getNewsPost(tokenId);
  decrementAuthorNewsPosts(post.newsPostAuthor, tokenId);
  let leftNewsPosts = getNewsPostsByAuthor(post.newsPostAuthor);
  logging.log("after delete");
  return leftNewsPosts;
}

function decrementAuthorNewsPosts(from: string, tokenId: string): void {
  let _postId = getNewsPostsByAuthor(from);
  for (let i=0; i<_postId.length; i++) {
    if (tokenId == _postId[i]) {
      _postId.splice(i, 1);
      logging.log("match");
      break;
    }
  }
  let nd = new NewsPostMetaData();
  nd.newsPostsData = _postId;
  newsPostsByAuthor.set(from, nd);
  deleteNewsPost(tokenId);
}

export function postNewsPost(
  newsPostId: string,
  newsVerificationHash: string
): NewsPost {
  logging.log("posting news post");
  return _postNewsPost(
    newsPostId,
    newsVerificationHash
  );
}

function _postNewsPost(
  newsPostId: string,
  newsVerificationHash: string
): NewsPost {
  logging.log("start posting news post");
  let post = new NewsPost();
  post.newsPostAuthor = context.sender;
  post.newsPostId = newsPostId;
  post.newsVerificationHash = newsVerificationHash;
  logging.log('setting news post data');
  setNewsPostData(post);
  logging.log('setting news post by author');
  setNewsPostsByAuthor(post);
  logging.log('adding news post id to vector')
  _addNewNewsPost(newsPostId);
  logging.log("posted news post");
  return post;
}

function _addNewNewsPost(newsPostId: string): void {
  let present = false;
  for(let i: i32 = 0; i < newsPosts.length; i++) {
    if (newsPosts[i] == newsPostId) {
      present = true;
    }
  }
  if (!present) {
    newsPosts.push(newsPostId);
  }
}

//ERROR handling
function _newsPostDNEError(post: NewsPost): boolean {
  return assert(post == null, "This news post does not exist");
}