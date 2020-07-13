// Identities for Textile ThreadsDB
@nearBindgen
export class UserIdentity {
    account: string;
    identity: string; //libp2p string of key
    threadId: string;
    memberId: u32;
    status: string;
}

@nearBindgen
export class AppIdentity {
    appId: string;
    identity: string; //libp2p string of key
    threadId: string;
    appNumber: u32;
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