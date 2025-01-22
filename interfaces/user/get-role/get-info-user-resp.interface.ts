export interface GetInfoUserResp {
 
  id: string;
  email: string;
  names: string;
  campUuid: string;
  role: Role;
  tokenBack: TokenBack;
}

export interface Role {
  id: string;
  name: string;
}

export interface TokenBack {
  tokenBackExpired: number;
  accessTokenBack: string;
  refreshTokenBack: string;
}

export interface DecodedAccessToken {
  sub: string;
  email: string;
  id: string;
  names: string;
  campUuid: string;
  role: Role;
  iat: number;
  exp: number;
}
