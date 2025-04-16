import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { locationResponse, visitorCategoryResponse, visitorResponse, visitorResponseById, whooomeToMeetList } from './pre-registration.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreRegistrationService {
  private API_PRE_REGISTRATION = `${environment.apiUrl}/Visitor`;
  private API_USER_AUTH = `${environment.apiUrl}/Auth`;
  private API_UPLOAD = `${environment.apiUrl}`;
  private API_USERS_URL = `${environment.apiUrl}/Invite`;

  // httpOptions : any = {
  //   headers: new HttpHeaders({
  //      'Content-Type': 'application/json',
  //      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  //   })
  //  };

  constructor(private http: HttpClient) {}

  AddVisitorDetailsByGetKeeper(data: any): Observable<any> {
    const url = `${this.API_USERS_URL}/AddVisitorDetailsByGetKeeper`;
    return this.http.post<any>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  imageUpload(formData: any): Observable<any> {
    const url = `${this.API_UPLOAD}/Image/UploadImage`;
    return this.http.post<any>(url,formData,{headers: {'Content-Type': 'multipart/form-data'}}).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }

  saveVisitorDetail(data: any): Observable<visitorResponse> {
    const url = `${this.API_USERS_URL}/AddUpdateVisitorDetail`;
    return this.http.post<visitorResponse>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponse>;
  }

  GetVisitorDetailsByPhoneNumber(number: number): Observable<visitorResponseById> {
    const url = `${this.API_PRE_REGISTRATION}/GetVisitorDetailsByPhoneNumber?phoneNumber=${number}`;
    return this.http.get<visitorResponseById>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponseById>;
  }

  GetVisitorDetailsById(id?: number): Observable<visitorResponseById> {
    const url = `${this.API_PRE_REGISTRATION}/GetVisitorDetailsByVisitorId?VisitorId=${id}`;
    return this.http.get<visitorResponseById>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorResponseById>;
  }

  GetCityList(): Observable<locationResponse> {
    const url = `${this.API_USER_AUTH}/GetCityList`;
    return this.http.get<locationResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<locationResponse>;
  }

  whooomeToMeetList(): Observable<whooomeToMeetList> {
    const url =  `${this.API_USERS_URL}/GetWhomtoMeetlist`;
    return this.http.get<whooomeToMeetList>(url).pipe( 
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<whooomeToMeetList>;
  }

  GetVisitorCategory(): Observable<visitorCategoryResponse> {
    const url =  `${this.API_PRE_REGISTRATION}/GetVisitorCategory`;
    return this.http.get<visitorCategoryResponse>(url).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<visitorCategoryResponse>;
  }
  AddVisitOfPreRegisteredVisitorByGetKeeper(data: any): Observable<any> {
    const url = `${this.API_USERS_URL}/AddVisitOfPreRegisteredVisitorByGetKeeper`;
    return this.http.post<any>(url,data).pipe(
      map((res) => res),
      catchError((err) => this.handleError(err))
    ) as Observable<any>;
  }


  public handleError(err: any): any {
    return throwError(err);
  }
}
