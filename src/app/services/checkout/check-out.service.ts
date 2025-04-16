import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, map, throwError } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {
  private API_USERS_URL_INVITE = `${environment.apiUrl}/Invite`;
  countryList = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

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
