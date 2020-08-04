// Identities for Textile ThreadsDB
@nearBindgen
export class UserIdentity {
    account: string;
    identity: string; //libp2p string of key
    threadId: string;
    memberId: string;
    status: string;
}

@nearBindgen
export class AppIdentity {
    appId: string;
    identity: string; //libp2p string of key
    threadId: string;
    appNumber: string;
    status: string;
}

// App Definitions
@nearBindgen
export class App {
    appNumber: string; //App ID
    appId: string; // App Title
    appCreatedDate: string;
    status: string;
}

@nearBindgen
export class AppsArray {
    apps: Array<string[]>;
    len: i32;
}

@nearBindgen
export class AppMetaData {
    applog: Array<string>;
}

// Member Definitions
@nearBindgen
export class Member {
    memberId: string;
    memberAccount: string;
    memberRole: string;
    memberJoinDate: string;
    status: string;
    profilePrivacy: string;
}

@nearBindgen
export class UserRole {
    user: string;
    role: string;
}

@nearBindgen
export class UserRoleArray {
    roles: Array<UserRole>;
    len: i32;
}

@nearBindgen
export class MembersArray {
    members: Array<string[]>;
    len: i32;
}

@nearBindgen
export class UserRoleMetaData {
    memberlog: Array<string>;
}

@nearBindgen
export class MemberMetaData {
    memberlog: Array<string>;
}

// News Posts Models
@nearBindgen
export class NewsPost {
    newsPostAuthor: string;
    newsPostId: string;
    newsVerificationHash: string;
    published: string;
}

@nearBindgen
export class NewsPostMetaData {
    newsPostsData: Array<string>
}

@nearBindgen
export class NewsPostArray {
    newsPosts: Array<string[]>;
    len: i32;
}

// Comments Models
@nearBindgen
export class Comment {
    commentAuthor: string;
    commentId: string;
    commentParent: string;
    commentVerificationHash: string;
    published: string;
}

@nearBindgen
export class CommentMetaData {
    commentData: Array<string>;
    len: i32;
}

@nearBindgen
export class CommentArray {
    comments: Array<string[]>;
    len: i32;
}

// Profiles Models
@nearBindgen
export class Profile {
    member: string;
    profileId: string;
    profileVerificationHash: string;
    privacy: string;
}

@nearBindgen
export class ProfileMetaData {
    profileData: Array<string>;
    len: i32;
}

@nearBindgen
export class ProfileArray {
    profiles: Array<string[]>;
    len: i32;
}

// Likes Models
@nearBindgen
export class Like {
    likeGiver: string; //always an account
    likeReceiver: string; //can be anything - post, profile, comment
    likeId: string;
    likeValue: string;
}

@nearBindgen
export class LikeMetaData {
    likeData: Array<string>;
    len: i32;
}

@nearBindgen
export class LikeArray {
    likes: Array<string[]>;
    len: i32;
}