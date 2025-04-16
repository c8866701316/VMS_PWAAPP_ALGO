import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  private API_USERS_URL = `${environment.apiUrl}/Visitor`;
  private API_USERS_URL_INVITE = `${environment.apiUrl}/Invite`;
  countryList = new BehaviorSubject([]);


  constructor(private http: HttpClient) {}

  GetVisitorDetailsById(id?: number): Observable<any> {
    const url = `${this.API_USERS_URL}/GetVisitorDetailsByVisitorId?VisitorId=${id}`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  GetInviteDetailsById(id: number): Observable<any> {
    const url = `${this.API_USERS_URL_INVITE}/GetInviteDetailsByInviteId?InviteId=${id}`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  GetVisitorDetailsByInvitecode(id:any): Observable<any> {
    const url = `${this.API_USERS_URL}/GetVisitorDetailsByInvitecode?InviteCode=${id}`;
    return this.http.get<any>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  CheckInVisitByQR(visitorId:number, inviteId:number): Observable<any> {
    const url = `${this.API_USERS_URL_INVITE}/CheckInVisit?visitorId=${visitorId}&inviteId=${inviteId}`;
    return this.http.post<any>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  CheckOutVisitByQR(visitorId: any,inviteId:any): Observable<any> {
    const url = `${this.API_USERS_URL_INVITE}/CheckOutVisit?visitorId=${visitorId}&inviteId=${inviteId}`;
    return this.http.post<any>(url,{}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }
  public handleError(err: any): any {
    return throwError(err);
  }
}
