import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';

import { AuthHTTPService } from './auth-http/auth-http.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { LOGIN_SUCCESS_RESPONSE, USER_DETAILS_BY_TOKEN, schoolSiteDetailsResponse, schoolSitePayload } from '../../models/login-response.model';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../../models/login.model';
import { LOGIN_SUCCESS_RESPONSE } from '../../models/login-response.model';
import { ToastrService } from 'ngx-toastr';
import { ToastController } from '@ionic/angular';
// import { VisitorService } from '../../../../pages/admin/services/visitors/visitor.service';
// import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;

  // public fields
  currentUser$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    // private visitorService: VisitorService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom' // You can adjust the position as needed
    });
    toast.present();
  }
  login(credential: LOGIN_CREDENTIAL_PAYLOAD): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(credential).pipe(
      tap((res: any) => {
        if (res?.value?.refreshToken) {
          localStorage.setItem("token", res?.value?.refreshToken);
          this.setAuthFromLocalStorage(res); // store full response
          this.currentUserSubject.next(res); // set user directly
        }
      }),
      map((res) => res), // return full res
      catchError((err) => {
        this.presentToast('Something went wrong.try again!', 'danger');
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  

  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if ( !auth || !auth.value.refreshToken) {
      this.logout();
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    this.currentUserSubject.next(auth);
    return of(auth);
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
    localStorage.clear()
  }

  private getAuthFromLocalStorage(): any | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private setAuthFromLocalStorage(auth: LOGIN_SUCCESS_RESPONSE): any {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.value.refreshToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  // getSchoolSiteDetails(payload:schoolSitePayload): Observable<schoolSiteDetailsResponse> {
  //   return this.authHttpService.GetSchoolSiteDetails(payload);
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
