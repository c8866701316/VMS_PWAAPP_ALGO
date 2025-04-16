export interface LOGIN_SUCCESS_RESPONSE {
  response: loginResponse
  value: loginResponseValue
}

export interface loginResponse {
  returnNumber: number
  errorMessage: string
}

export interface loginResponseValue {
  id: number
  firstName: any
  lastName: any
  username: string
  jwtToken: string
  userID: string
  staffid: number
  defaultSiteId: number
  orgId: number
  accessLevel: number
  admincred: any
  loginHID: string
  sessionYearTxt: string
  toApps: any
  randomNumber: any
  isSMSRequired: boolean
  type: number
  schoolId: number
  refreshToken:string
}

export interface loginValue {
    access_token:  null;
    id_token:      string;
    expires_in:    number;
    token_type:    string;
    refresh_token: string;
    UserStatus:    number;
    Role:          string;
    dealGroupList: null;
}

export interface USER_DETAILS_BY_TOKEN {
    response: userResponse;
    value:    userValue;
}

export interface userResponse {
    returnNumber: number;
    errorMessage: string;
}

export interface userValue {
    emailID:   string;
    firstName: string;
}

export interface schoolSiteDetailsResponse {
    school: School[]
    site: Site[]
    response: schoolSiteResponse
  }
  
  export interface School {
    value: string
    text: string
  }
  
  export interface Site {
    value: string
    text: string
  }
  
  export interface schoolSiteResponse {
    returnNumber: number
    errorMessage: string
  }

export interface schoolSitePayload{
    UserName:string,
    Password:string
}
  