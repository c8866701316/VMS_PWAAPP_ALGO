import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../../../models/login.model';
import { LOGIN_SUCCESS_RESPONSE, USER_DETAILS_BY_TOKEN, schoolSiteDetailsResponse, schoolSitePayload } from '../../../models/login-response.model';

const API_USERS_URL = `${environment.apiUrl}/Auth`;

console.log(API_USERS_URL,"API_USERS_URL");
// alert(`${API_USERS_URL}`)

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // user login
  login(credentialPayload:LOGIN_CREDENTIAL_PAYLOAD): Observable<LOGIN_SUCCESS_RESPONSE> {
    return this.http.post<LOGIN_SUCCESS_RESPONSE>(`${API_USERS_URL}/GateKeeperLogin`,credentialPayload);
    // return this.http.post<LOGIN_SUCCESS_RESPONSE>(`http://192.168.2.9:8015/Auth/GateKeeperLogin`,credentialPayload);
  }

  UserDetailsByToken(token:any): Observable<USER_DETAILS_BY_TOKEN> {
    return this.http.get<USER_DETAILS_BY_TOKEN>(`${API_USERS_URL}/UserDetailsByToken?Refresh_Token=${token.refresh_Token}`);
  }

  public handleError(err: any): any {
    return throwError(err);
  }
}
