import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { isControlInvalid } from 'src/app/helpers/_validators';
import { AuthService } from '../services/auth/auth.service';
import { LOGIN_CREDENTIAL_PAYLOAD } from '../models/login.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit,OnDestroy {
  loginCredential:LOGIN_CREDENTIAL_PAYLOAD = {
    userId: "",
    password: "",
    // orgName :''
    // schoolId: 0,
    // siteId: 0,
    // grant_Type: "",
    // refresh_Token: ""
  }
  hasError: boolean = false;

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = []; 
  responseError:string='';
  OrgName:string=''
  

  loginFormGroup:FormGroup = this.fb.group({
    userId: ['', Validators.compose([Validators.required])],
    password: ['', [Validators.required]],
    // schoolNames: [null, Validators.required],
    // schoolSiteNames: [null, Validators.required],
   });
    constructor(  private fb: FormBuilder,private authService: AuthService,private router: Router,private toastController: ToastController) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();
   }
  
  
  ngOnInit() {
    const hostName = window.location.hostname
    this.OrgName = hostName.split('.')[0]
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top' // You can adjust the position as needed
    });
    toast.present();
  }
  togglePasswordVisibility() {
    // const inputType = this.passwordField.nativeElement.type;
    // this.passwordField.nativeElement.type = inputType === 'password' ? 'text' : 'password';
  }
  onSubmit(){
    this.isLoadingSubject.next(true);
    const formControls = this.loginFormGroup.controls;
    this.loginCredential.userId = formControls['userId'].value;
    this.loginCredential.password = formControls['password'].value;
    // this.loginCredential.orgName = "hcps";
    // this.loginCredential.schoolId = 1;
    // this.loginCredential.siteId = 2;
    localStorage.clear()
    const loginSubscr = this.authService
      .login(this.loginCredential)
      .subscribe((user: any) => {
        if (user && user.response?.returnNumber === 200) {
          this.presentToast('Login successful!', 'success');
          this.router.navigate(['/gatekeeper/dashboard']);
        } else {
          this.hasError = true;
        }
      },(error) => {
        this.responseError='Something went wrong.try again!'+ error.message;
        this.presentToast(this.responseError, 'danger');
        // this.toastr.error(this.responseError, 'Error', {timeOut: 3000});
        this.isLoadingSubject.next(false);
      });
    this.unsubscribe.push(loginSubscr);
  }

  isControlInvalidWrapper(controlName: string): boolean {
    return isControlInvalid(this.loginFormGroup.get(controlName)!);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
