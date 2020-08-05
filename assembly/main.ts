import {
  env,
  Context,
  storage,
  logging, 
  PersistentVector, 
  PersistentMap } from "near-sdk-as";
// available class: context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math

import {  UserIdentity,
          AppIdentity, 
          UserRole, UserRoleMetaData,
          App, AppMetaData,
          Member, MemberMetaData, MembersArray,
          Profile, ProfileMetaData, ProfileArray,
          NewsPost, NewsPostArray, NewsPostMetaData,
          Comment, CommentMetaData, CommentArray, 
          Like, LikeMetaData, LikeArray,
          } from "./model";

// Collections where we store data
// store user identity
let userIdentity = new PersistentMap<string, UserIdentity>("userIdentity");

// store app identities
let appIdentity = new PersistentMap<string, AppIdentity>("appIdentity");
let apps = new PersistentVector<string>("apps");
let appProfile = new PersistentMap<string, AppMetaData>("appdata");

// store all unique news posts
let newsPosts = new PersistentVector<string>("news");
let newsPostMeta = new PersistentMap<string, NewsPostMetaData>("newsdata");

// store all news posts of a particular author
let indivNewsPosts = new PersistentMap<string, NewsPost>("indivnews");
let newsPostsByAuthor = new PersistentMap<string, NewsPostMetaData>("newsByAuthor");

// store all unique comments
let comments = new PersistentVector<string>("comment");
let commentMeta = new PersistentMap<string, CommentMetaData>("commentdata");

// store all comments of a particular author
let indivComments = new PersistentMap<string, Comment>("indivcomments");
let commentsByAuthor = new PersistentMap<string, CommentMetaData>("commentsByAuthor");

// user role storage
let userRoleList = new PersistentVector<UserRoleMetaData>("role");
let users = new PersistentVector<string>("users");
let userRoles = new PersistentMap<string, UserRoleMetaData>("userRoles");

// Member storage
let members = new PersistentVector<string>("members");
let memberProfile = new PersistentMap<string, MemberMetaData>("memberdata");

// Profile storage
let indivProfiles = new PersistentMap<string, Profile>("indivProfiles");
let profileMeta = new PersistentMap<string, ProfileMetaData>("profiledata");
let profiles = new PersistentVector<string>("profiles");

// Likes
let likes = new PersistentVector<string>("likes");
let likeMeta = new PersistentMap<string, LikeMetaData>("likedata");
let indivLikes = new PersistentMap<string, Like>("indivLikes");
let likesByGiver = new PersistentMap<string, LikeMetaData>("likesByGiver")

// member Id counter (not currently used)
function _incrementCounter(value: u32): void {
  const newCounter = storage.getPrimitive<u32>("memberId", 0) + value;
  storage.set<u32>("memberId", newCounter);
  
}

function _getMemberId(): u32 {
  return storage.getPrimitive<u32>("memberId", 0);
}


// Create new identity for User threadsDB
export function setIdentity(account: string, identity: string, threadId: string, status: string): void {
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
      newId.identity = identity;
      newId.threadId = threadId;
      newId.memberId = thisMemberId.toString();
      newId.status = status;
      userIdentity.set(Context.sender, newId);
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
export function setAppIdentity(appId: string, identity: string, threadId: string, status: string): void {
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
      newAppIdentity.identity = identity;
      newAppIdentity.threadId = threadId;
      newAppIdentity.appNumber = thisAppNumber.toString();
      newAppIdentity.status = status;
      appIdentity.set(appId, newAppIdentity);
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


// App Management
export function setAppData(app: App): void {
  let _appNumber = getAppData(app.appNumber);
  logging.log('setting member data')
  logging.log(_appNumber)
  if(_appNumber == null) {
    _appNumber = new Array<string>();
    _appNumber.push(app.appNumber); 
    _appNumber.push(app.appId);
    _appNumber.push(app.appCreatedDate);
    _appNumber.push(app.status);
    logging.log(_appNumber)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _appNumber.length; i++){
      if (_appNumber[0] == app.appNumber) {
        present = true;
        break;
      }
    }
    if (!present) {
      _appNumber.push(app.appNumber); 
      _appNumber.push(app.appId);
      _appNumber.push(app.appCreatedDate);
      _appNumber.push(app.status);
    }
  }
  let appData = new AppMetaData();
  appData.applog = _appNumber;
  appProfile.set(app.appNumber, appData);
  logging.log(appProfile);
  logging.log(app.appNumber);
  logging.log(appData);
}

function _addNewApp(appNumber: string): void {
  let present = false;
  for(let i: i32 = 0; i < apps.length; i++) {
    if (apps[i] == appNumber) {
      present = true;
    }
  }
  if (!present) {
    apps.push(appNumber);
  }
}

export function getAppData(appNumber: string): Array<string> {
  let app = appProfile.get(appNumber);
  logging.log('getting app data')
  logging.log(app)
  if(!app) {
    return new Array<string>();
  }
  let appData = app.applog;
  return appData;
}

export function registerApp(
  appNumber: string,
  appId: string,
  appCreatedDate: string,
  status: string
  ): App {
  logging.log("registering app");
  return _registerApp(
    appNumber,
    appId,
    appCreatedDate,
    status
  );
  }
  
  function _registerApp(
    appNumber: string,
    appId: string,
    appCreatedDate: string,
    status: string
  ): App {
    logging.log("start registering new app");
    let app = new App();
    app.appNumber = appNumber;
    app.appId = appId;
    app.appCreatedDate = appCreatedDate;
    app.status = status;
    setAppData(app);
    _addNewApp(appId);
    logging.log("registered new app");
    return app;
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

export function changeUserRole(user: string, role: string): void {
  if(Context.sender == 'guildleader.testnet') {
    logging.log('deleting old user')
    userRoles.delete(user)
    logging.log('registering new user/role')
    _registerUserRole(user, role);
  } else {
    logging.log("unauthorized function call");
  }
}

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


// Member Management
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

export function addMissingMember(memberId: string): void {
  let present = false;
  for(let i: i32 = 0; i < members.length; i++) {
    if (members[i] == memberId) {
      present = true;
    }
  }
  if (!present) {
    _addNewMember(memberId)
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

export function getNewsPostsByAuthor(author: string): Array<string> {
let postId= newsPostsByAuthor.get(author);
  if(!postId) {
    return new Array<string>();
  }
  let id = postId.newsPostsData;
  return id;
}

export function setNewsPostsByAuthor(post: NewsPost): void {
  let _postId= getNewsPostsByAuthor(post.newsPostAuthor);
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


// Methods for Consolidated Lists
export function getAllNewsPosts(): NewsPostArray {
  logging.log('retrieving news posts');
  let _newsPostList = new Array<string[]>();
  logging.log(newsPosts);
  for(let i: i32 = 0; i < newsPosts.length; i++) {
    let _newsPost = getNewsPostData(newsPosts[i]);
    logging.log(_newsPost)
    if(_newsPost.length!=0){
    _newsPostList.push(_newsPost);
    }
  }
  let nl = new NewsPostArray();
  nl.newsPosts = _newsPostList;
  nl.len = _newsPostList.length;
  logging.log(nl)
  return nl;
}

export function getAllComments(): CommentArray {
  logging.log('retrieving comments');
  let _commentList = new Array<string[]>();
  logging.log(comments);
  for(let i: i32 = 0; i < comments.length; i++) {
    let _comment = getCommentData(comments[i]);
    logging.log(_comment)
    _commentList.push(_comment);
  }
  let nl = new CommentArray();
  nl.comments = _commentList;
  nl.len = _commentList.length;
  logging.log(nl)
  return nl;
}

export function getAllProfiles(): ProfileArray {
  logging.log('retrieving profiles');
  let _profileList = new Array<string[]>();
  logging.log(profiles);
  for(let i: i32 = 0; i < profiles.length; i++) {
    let _profile = getProfileData(profiles[i]);
    logging.log(_profile)
    _profileList.push(_profile);
  }
  let nl = new ProfileArray();
  nl.profiles = _profileList;
  nl.len = _profileList.length;
  logging.log(nl)
  return nl;
}

export function getAllLikes(): LikeArray {
  logging.log('retrieving likes');
  let _likeList = new Array<string[]>();
  logging.log(likes);
  for(let i: i32 = 0; i < likes.length; i++) {
    let _like = getLikeData(likes[i]);
    logging.log(_like)
    _likeList.push(_like);
  }
  let nl = new LikeArray();
  nl.likes = _likeList;
  nl.len = _likeList.length;
  logging.log(nl)
  return nl;
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
  return Context.sender;
}

export function deleteNewsPost(tokenId: string): void {
  indivNewsPosts.delete(tokenId);
  newsPostMeta.delete(tokenId)
  newsPostsByAuthor.delete(tokenId)
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
  logging.log('postId')
  logging.log(_postId)
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

export function setNewsPostData(post: NewsPost): void {
  let _postId = getNewsPostData(post.newsPostId);
  logging.log('setting news post data')
  logging.log(_postId)
  if(_postId == null) {
    _postId = new Array<string>();
    _postId.push(post.newsPostId); 
    _postId.push(post.newsPostAuthor);
    _postId.push(post.newsVerificationHash);
    _postId.push(post.published);
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
    _postId.push(post.published);
    }
  }
  let newsPostData = new NewsPostMetaData();
  newsPostData.newsPostsData = _postId;
  newsPostMeta.set(post.newsPostId, newsPostData);
  logging.log(newsPostMeta);
  logging.log(post.newsPostId);
  logging.log(newsPostData);
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

export function postNewsPost(
  newsPostId: string,
  newsVerificationHash: string,
  published: string
): NewsPost {
  logging.log("posting news post");
  return _postNewsPost(
    newsPostId,
    newsVerificationHash,
    published
  );
}

function _postNewsPost(
  newsPostId: string,
  newsVerificationHash: string,
  published: string
): NewsPost {
  logging.log("start posting news post");
  let post = new NewsPost();
  post.newsPostAuthor = Context.sender;
  post.newsPostId = newsPostId;
  post.newsVerificationHash = newsVerificationHash;
  post.published = published;
  logging.log('setting news post data');
  setNewsPostData(post);
  logging.log('setting news post by author');
  setNewsPostsByAuthor(post);
  logging.log('adding news post id to vector')
  _addNewNewsPost(post.newsPostId);
  logging.log("posted news post");
  setNewsPost(post);
  logging.log("posted indiv news post")
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


// Methods for Individual Comments
export function getComment(commentId: string): Comment {
  let comment = indivComments.getSome(commentId);
  return comment;
}

export function getCommentsByAuthor(author: string): Array<string> {
  let commentId = commentsByAuthor.get(author);
  if(!commentId) {
    return new Array<string>();
  }
  let id = commentId.commentData;
  return id;
}

export function setComment(comment: Comment): void {
  indivComments.set(comment.commentId, comment);
}

export function setCommentByAuthor(comment: Comment): void {
  let _commentId = getCommentsByAuthor(comment.commentAuthor);
  if(_commentId == null) {
    _commentId = new Array<string>();
    _commentId.push(comment.commentId);
  } else {
    _commentId.push(comment.commentId);
  }
  let nd = new CommentMetaData();
  nd.commentData = _commentId;
  commentsByAuthor.set(comment.commentAuthor, nd);
}

export function setCommentData(comment: Comment): void {
  let _commentId = getCommentData(comment.commentId);
  logging.log('setting comment data')
  logging.log(_commentId)
  if(_commentId == null) {
    _commentId = new Array<string>();
    _commentId.push(comment.commentId);
    _commentId.push(comment.commentParent);
    _commentId.push(comment.commentAuthor);
    _commentId.push(comment.commentVerificationHash);
    _commentId.push(comment.published);
    logging.log(_commentId)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _commentId.length; i++){
      if (_commentId[0] == comment.commentId) {
        present = true;
        break;
      }
    }
    if (!present) {
    _commentId.push(comment.commentId);
    _commentId.push(comment.commentParent);
    _commentId.push(comment.commentAuthor);
    _commentId.push(comment.commentVerificationHash);
    _commentId.push(comment.published);
    }
  }
  let commentData = new CommentMetaData();
  commentData.commentData = _commentId;
  commentMeta.set(comment.commentId, commentData);
  logging.log(commentMeta);
  logging.log(comment.commentId);
  logging.log(commentData);
}

export function getCommentData(commentId: string): Array<string> {
  let comment = commentMeta.get(commentId);
  logging.log('getting comment data')
  logging.log(comment)
  if(!comment) {
    return new Array<string>();
  }
  let commentData = comment.commentData;
  return commentData;
}

export function addComment(
  commentId: string,
  commentParent: string,
  commentVerificationHash: string,
  published: string
): Comment {
  logging.log("adding comment");
  return _addComment(
    commentId,
    commentParent,
    commentVerificationHash,
    published
  );
}

function _addComment(
  commentId: string,
  commentParent: string,
  commentVerificationHash: string,
  published: string
): Comment {
  logging.log("start adding new comment");
  let comment = new Comment();
  comment.commentAuthor = Context.sender;
  comment.commentParent = commentParent;
  comment.commentId = commentId;
  comment.commentVerificationHash = commentVerificationHash;
  comment.published = published;
  logging.log('setting new comment');
  setCommentData(comment);
  logging.log('setting new comment by author');
  setCommentByAuthor(comment);
  logging.log('adding new comment to vector')
  _addNewComment(commentId);
  logging.log("added comment");
  setComment(comment)
  logging.log("added indiv comment")
  return comment;
}

function _addNewComment(commentId: string): void {
  let present = false;
  for(let i: i32 = 0; i < comments.length; i++) {
    if (comments[i] == commentId) {
      present = true;
    }
  }
  if (!present) {
    comments.push(commentId);
  }
}


export function deleteComment(commentId: string): void {
  indivComments.delete(commentId);
}

export function deleteCommentProfile(commentId: string): Array<string> {
  let comment = getComment(commentId);
  decrementAuthorComments(comment.commentAuthor, commentId);
  let leftComments = getCommentsByAuthor(comment.commentAuthor);
  logging.log("comments left after delete");
  return leftComments;
}

function decrementAuthorComments(from: string, commentId: string): void {
  let _commentId = getCommentsByAuthor(from);
  for (let i=0; i<_commentId.length; i++) {
    if (commentId == _commentId[i]) {
      _commentId.splice(i, 1);
      logging.log("match");
      break;
    }
  }
  let nd = new CommentMetaData();
  nd.commentData = _commentId;
  commentsByAuthor.set(from, nd);
  deleteComment(commentId);
}

// Methods for Profiles

export function getProfile(profileId: string): Profile {
  let profile = indivProfiles.getSome(profileId);
  return profile;
}

export function setProfileData(profile: Profile): void {
  let _profileId = getCommentData(profile.profileId);
  logging.log('setting profile data')
  logging.log(_profileId)
  if(_profileId == null) {
    _profileId = new Array<string>();
    _profileId.push(profile.profileId);
    _profileId.push(profile.member);
    _profileId.push(profile.profileVerificationHash);
    _profileId.push(profile.privacy);
    logging.log(_profileId)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _profileId.length; i++){
      if (_profileId[0] == profile.profileId) {
        present = true;
        break;
      }
    }
    if (!present) {
    _profileId.push(profile.profileId);
    _profileId.push(profile.member);
    _profileId.push(profile.profileVerificationHash);
    _profileId.push(profile.privacy);
    }
  }
  let profileData = new ProfileMetaData();
  profileData.profileData = _profileId;
  profileMeta.set(profile.profileId, profileData);
  logging.log(profileMeta);
  logging.log(profile.profileId);
  logging.log(profileData);
}

export function getProfileData(profileId: string): Array<string> {
  let profile = profileMeta.get(profileId);
  logging.log('getting profile data')
  logging.log(profile)
  if(!profile) {
    return new Array<string>();
  }
  let profileData = profile.profileData;
  return profileData;
}

export function addProfile(
  profileId: string,
  profileVerificationHash: string,
  privacy: string
): Profile {
  logging.log("adding profile");
  return _addProfile(
    profileId,
    profileVerificationHash,
    privacy
  );
}

function _addProfile(
  profileId: string,
  profileVerificationHash: string,
  privacy: string
): Profile {
  logging.log("start adding new profile");
  let profile = new Profile();
  profile.profileId = profileId;
  profile.member = Context.sender;
  profile.profileVerificationHash = profileVerificationHash;
  profile.privacy = privacy;
  logging.log('setting new profile');
  setProfileData(profile);
  logging.log('setting new profile by author');
  _addNewProfile(profileId);
  logging.log("added profile");
  return profile;
}

function _addNewProfile(profileId: string): void {
  let present = false;
  for(let i: i32 = 0; i < profiles.length; i++) {
    if (profiles[i] == profileId) {
      present = true;
    }
  }
  if (!present) {
    profiles.push(profileId);
  }
}

export function deleteProfile(profileId: string): void {
  indivProfiles.delete(profileId);
}

// Methods for Likes
export function getLike(likeId: string): Like {
  let like = indivLikes.getSome(likeId);
  return like;
}

export function getLikesByGiver(giver: string): Array<string> {
  let likeId = likesByGiver.get(giver);
  if(!likeId) {
    return new Array<string>();
  }
  let id = likeId.likeData;
  return id;
}

export function setLikesByGiver(like: Like): void {
  let _likeId = getLikesByGiver(like.likeGiver);
  if(_likeId == null) {
    _likeId = new Array<string>();
    _likeId.push(like.likeId);
  } else {
    _likeId.push(like.likeId);
  }
  let nd = new LikeMetaData();
  nd.likeData = _likeId;
  likesByGiver.set(like.likeGiver, nd);
}

export function setLikeData(like: Like): void {
  let _likeId = getLikeData(like.likeId);
  logging.log('setting like data')
  logging.log(_likeId)
  if(_likeId == null) {
    _likeId = new Array<string>();
    _likeId.push(like.likeId);
    _likeId.push(like.likeGiver);
    _likeId.push(like.likeReceiver);
    _likeId.push(like.likeValue);
    logging.log(_likeId)
  } else {
    let present = false;
    for(let i: i32 = 0; i < _likeId.length; i++){
      if (_likeId[0] == like.likeId) {
        present = true;
        break;
      }
    }
    if (!present) {
    _likeId.push(like.likeId);
    _likeId.push(like.likeGiver);
    _likeId.push(like.likeReceiver);
    _likeId.push(like.likeValue);
    }
  }
  let likeData = new LikeMetaData();
  likeData.likeData = _likeId;
  likeMeta.set(like.likeId, likeData);
  logging.log(likeMeta);
  logging.log(like.likeId);
  logging.log(likeData);
}

export function getLikeData(likeId: string): Array<string> {
  let like = likeMeta.get(likeId);
  logging.log('getting like data')
  logging.log(like)
  if(!like) {
    return new Array<string>();
  }
  let likeData = like.likeData;
  return likeData;
}

export function addLike(
  likeId: string,
  likeReceiver: string,
  likeValue: string
): Like {
  logging.log("adding like");
  return _addLike(
    likeId,
    likeReceiver,
    likeValue
  );
}

function _addLike(
  likeId: string,
  likeReceiver: string,
  likeValue: string
): Like {
  logging.log("start adding new like");
  let like = new Like();
  like.likeGiver = Context.sender;
  like.likeReceiver = likeReceiver;
  like.likeId = likeId;
  like.likeValue = likeValue;
  logging.log('setting new like');
  setLikeData(like);
  logging.log('setting new like by author');
  setLikesByGiver(like);
  logging.log('adding new like to vector')
  _addNewLike(likeId);
  logging.log("added like");
  return like;
}

function _addNewLike(likeId: string): void {
  let present = false;
  for(let i: i32 = 0; i < likes.length; i++) {
    if (likes[i] == likeId) {
      present = true;
    }
  }
  if (!present) {
    likes.push(likeId);
  }
}


export function deleteLike(likeId: string): void {
  indivLikes.delete(likeId);
}

export function deleteLikeProfile(likeId: string): Array<string> {
  let like = getLike(likeId);
  decrementGiverLikes(like.likeGiver, likeId);
  let leftLikes = getLikesByGiver(like.likeGiver);
  logging.log("likes left after delete");
  return leftLikes;
}

function decrementGiverLikes(from: string, likeId: string): void {
  let _likeId = getLikesByGiver(from);
  for (let i=0; i<_likeId.length; i++) {
    if (likeId == _likeId[i]) {
      _likeId.splice(i, 1);
      logging.log("match");
      break;
    }
  }
  let nd = new LikeMetaData();
  nd.likeData = _likeId;
  likesByGiver.set(from, nd);
  deleteLike(likeId);
}



//ERROR handling
function _newsPostDNEError(post: NewsPost): boolean {
  return assert(post == null, "This news post does not exist");
}