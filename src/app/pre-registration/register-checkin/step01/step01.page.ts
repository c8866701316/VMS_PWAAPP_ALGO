import { CdkStepper } from '@angular/cdk/stepper';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of, switchMap } from 'rxjs';
import { PHONE_REGEX } from 'src/app/helpers/_constants';

import { CameraResultType, CameraSource, Photo, Camera } from '@capacitor/camera';

import { PreRegistrationService } from 'src/app/services/pre-registration/pre-registration.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-step01',
  templateUrl: './step01.page.html',
  styleUrls: ['./step01.page.scss'],
})
export class Step01Page implements OnInit, OnDestroy {
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @ViewChild('cdkStepper', { static: true }) cdkStepper: CdkStepper | undefined;

  countriesList: any;
  unsubscribe: Subscription[] = [];
  errorMsg:string='';
  stateList: any = [];
  citiesList: any[] = [];
  errorMessage: string='';
  hostlistData: any[] = [];
  categorylistData :any[]=[];
  newVisitorId:number = 0;
  visitorId: number = 0;
  isAddedOtherCategory:boolean=false;
  editFileName:string='';
  editFilePath:string='';
  isVIPStatus: boolean = false;
  visitorProfile: string='';
  selectedImage: any;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  isAddLoading$: Observable<boolean>;
  isAddLoadingSubject: BehaviorSubject<boolean>;
  phoneNumber :number | undefined;
  step1Data: any = {};
  isDesable:boolean =true
  filteredHostList: any[] = [];
  filteredCityList: any[] = [];
  selectedHost: any;
  selectedCity: any;
  selectedRadioValue: any;
  selectedcityRadioValue: any;
  isSearchLoading$: Observable<boolean>;
  isLoadingSearchSubject: BehaviorSubject<boolean>;
  iscityLoading$: Observable<boolean>;
  isLoadingcitySubject: BehaviorSubject<boolean>;

visitorForm: FormGroup = this.formBuilder.group({
  firstName: ['', Validators.required],
  lastName: ['', Validators.required],
  phone: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
  email: ['', [Validators.required, Validators.email]],
  address: ['', Validators.required],
  idProof:['',Validators.required],
  host: [null, Validators.required],
  city: [null,Validators.required],
  state: [null],
  country: [null],
  category:[null, Validators.required],
  reason:[null,Validators.required]
  // blockedEntry: [null, Validators.required],
  // vipEntry: [null, Validators.required],
  // vipStatus: [null],
});
get host() {
  return this.visitorForm.get('host') as FormControl
}
get city() {
  return this.visitorForm.get('city') as FormControl
}
fetchvisitorForm: FormGroup = this.formBuilder.group({
  mobileNum: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
  blockedEntry: [''], // Ensure this matches the name in the template
  vipEntry: [''], // Also include other form controls
  // Also include other form controls
  // ... other fo
});

constructor(private formBuilder: FormBuilder ,private router: Router,private preRegistrationService: PreRegistrationService,private route: ActivatedRoute,private toastController: ToastController ,private alertController: AlertController) {
  this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();
  this.isAddLoadingSubject = new BehaviorSubject<boolean>(false);  this.isAddLoading$ = this.isAddLoadingSubject.asObservable();
  this.isLoadingSearchSubject = new BehaviorSubject<boolean>(false);  this.isSearchLoading$ = this.isLoadingSearchSubject.asObservable();
  this.isLoadingcitySubject = new BehaviorSubject<boolean>(false);  this.iscityLoading$ = this.isLoadingcitySubject.asObservable();

  this.route.params.subscribe((params : any) => {
    this.phoneNumber = params['mobileNum'];
  });
  //  const payload = {
    //   phone: this.phoneNumber
    //  }
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
  goToNextStep() {
     const emailControl = this.visitorForm.get('email');
 if (emailControl) {
    emailControl.setValue(emailControl.value.trim(), {emitEvent: false});
 }
    if (this.visitorForm.invalid) {
      Object.values(this.visitorForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    if (this.cdkStepper) {
      // Call the next() method of the stepper to move to the next step
      this.step1Data = this.visitorForm.value;
      this.cdkStepper.next();
    }
  }

ngOnInit() {
  // this.preRegistrationService.getVisitorCountryStateCityList().subscribe();
  this.visitorForm.patchValue({
    phone : this.phoneNumber
 })
  this.getHostDrop();
  this.getCategoryListData();
  this.getLocationsData();
  this.setupCountryOptions();
  this.setupStateOptions();
  this.setupEmailValidation();
  // this.visitorForm.addControl('category', this.formBuilder.control(null,Validators.required));

  this.visitorForm.get('category')?.valueChanges.subscribe(catRes => {
    if (catRes?.value === '3' && catRes) {
      this.isAddedOtherCategory = true;
      this.visitorForm.addControl('OtherCategory', this.formBuilder.control(null,Validators.required));
    }else{
      this.isAddedOtherCategory = false;
      this.visitorForm.removeControl('OtherCategory');
    }
  });
}

setupEmailValidation() {
  this.visitorForm.get('email')?.valueChanges.subscribe(value => {
     // Here, you can check if the form control is valid
     const emailControl = this.visitorForm.get('email');

     if (!emailControl?.valid) {
      emailControl?.setValue(emailControl.value.trim(), {emitEvent: false});
     } 
  });
 }
ionViewWillLeave() {
  this.selectedHost = null;
}

handleStepClick(event: any) {  
  if (this.visitorForm.invalid) {
  event.preventDefault();
  event.stopPropagation();
  }
}
// goToNextStep() {
//   if (this.cdkStepper) {
//     // Call the next() method of the stepper to move to the next step
//     this.step1Data = this.visitorForm.value;
//     this.cdkStepper.next();
//   }
// }

getCategoryListData() {
  this.preRegistrationService.GetVisitorCategory().subscribe(
    (response) => {
      this.categorylistData = response.value;
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}
onFileInputChange(event: any) {
  const file = event.target.files[0];
  // console.log('file', file);
  this.selectedImage = file
}


onFileChange(event: any): void {
  const fileList: FileList | null = event.target.files;
  // console.log('fileList', fileList, event.target);
  
  if (!fileList || fileList.length === 0) {
    return;
  }

  // const selectedFile: File = fileList[0];
  // const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
  // const fileName: string = selectedFile.name.toLowerCase();
  // const isValidFileType: boolean = allowedFileTypes.some(type => fileName.endsWith(type));
  // this.selectedFile = selectedFile;
  // if (!isValidFileType) {
  //   this.errorText='*Please choose a PNG or JPG or JPEG file.';
  //   this.selectedFile=null;
  //   return;
  // }

  // this.selectedImage = selectedFile;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.selectedImage = e.target.result;

  };
  // console.log("on file change ",this.selectedImage);
  
  const result = reader.readAsDataURL(event.target.files[0]);
  // console.log({result});
  
}

async openImagePicker() {
  try {

    const image = await Camera.getPhoto({
      quality: 100,
      // allowEditing: false,
      resultType: CameraResultType.Uri,
      // source: CameraSource.Photos,
    });
    // Set the selected image URI
    // console.log({image});
    this.selectedImage = image;
    // console.log('Selected image data URL:', this.selectedImage);
    // this.onFileChange(event)
  } catch (error) {
    console.error('Error selecting image:', error);
  }
}

handleRefresh(event:any) {
  setTimeout(() => {
    // Any calls to load data go here
    event.target.complete();
  }, 2000);
}

getHostDrop(): any {
  this.isLoadingSearchSubject.next(true)
  const hostList = this.preRegistrationService.whooomeToMeetList().subscribe(
    (response) => {
      this.hostlistData = response.value.sort((a: any, b: any) =>  a.text.localeCompare(b.text));
      this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
      this.isLoadingSearchSubject.next(false)
    },
    (error) => {
      console.error('Error:', error);
      this.isLoadingSearchSubject.next(false)

    }
  );
  this.unsubscribe.push(hostList);
}

fetchVisitor() {
  const { mobileNum } = this.fetchvisitorForm.value;
  this.preRegistrationService.GetVisitorDetailsByPhoneNumber(mobileNum).subscribe((res)=>{
    if (res.response.returnNumber===404 || res.response.returnNumber===401 ) {
      this.visitorForm.reset();
      this.errorMsg=res.response.errorMessage || '';
      this.presentToast(this.errorMsg, 'danger');
      // this.toastr.error(this.errorMsg, 'Error', {timeOut: 3000});
    }else if(res.response.returnNumber===200){
      this.errorMsg='';
      const visitorId = res.value.visitorId;
      this.visitorProfile = res.value.fileName;
      this.presentToast('Visitor Fetched Successfully!', 'success');
      // this.toastr.success('Visitor Fetched Successfully!', 'Success', {timeOut: 3000});
      this.getVisitorData(visitorId);
      this.newVisitorId=res.value.visitorId
    }
  })
}


async getVisitorData(visitorId: number) {
  this.isLoadingSubject.next(true);
  const visiorDataSusc = this.preRegistrationService.GetVisitorDetailsById(visitorId).subscribe(
    async (response) => {
      if (Object.keys(response.value).length > 0) {
        this.visitorId = response.value.visitorId;
        this.editFileName = response.value.fileName;
        this.editFilePath = response.value.photo;
        // await this.getVIPStatusData();
        // const vipStatusValue = this.getTypeOfVipValues(response.value.typeOfVIP);
        const payload = {
          visitorid: response.value.visitorId,
          firstName: response.value.firstName,
          lastName: response.value.lastName,
          email: response.value.email || '',
          address: response.value.address || '',
          idProof: response.value.idProof,
          // country: response.value?.country?this.getCountryName(response.value?.country):null,
          // state: response.value?.state?this.getStateName(response.value?.state):null,
          // city: response.value?.city?this.getCityName(response.value?.city):null,
        }; 
        
        this.visitorForm.patchValue({
          ...payload,
        });
      }
      this.isLoadingSubject.next(false)
    },
    (error) => {
      this.isLoadingSubject.next(false)
      // Handle error 
      console.error('Error:', error);
    }
  );
  this.unsubscribe.push(visiorDataSusc);
}

// getCountryName(countryId: number): string {
//   const country = this.countriesList.find((c:any) => c.id === countryId);
//   return country ? country : '';
// }

// getStateName(stateId: number): string {
//   const state = this.countriesList.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).find((s : any) => s.id === stateId);
//   return state ? state : '';
// }

// getCityName(cityId: number): string {
//   const city = this.countriesList.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).reduce((acc : any, cur : any) => [...acc, ...cur.cities], []).find((c : any) => c.id === cityId);
//   return city ? city : '';
// }
hostRadioSelect(host: any) {
  this.selectedRadioValue = host; // Update the selected value when a radio button is selected
}

cityRadioSelect(city: any) {
  this.selectedcityRadioValue = city; // Update the selected value when a radio button is selected
}

selectCityItem() {
  this.selectedCity = this.city.value;
  this.filteredHostList = JSON.parse(JSON.stringify(this.citiesList))
 }

 clearCityListItem() {
  let city = this.selectedCity ?? null;
  this.visitorForm.patchValue({ city })
  this.filteredHostList = JSON.parse(JSON.stringify(this.citiesList))
 }
filterCityList(event:any){
  const enteredData = event.target.value;
  const CityListClone = JSON.parse(JSON.stringify(this.citiesList))
  if (!!enteredData)
  this.filteredCityList = CityListClone.filter((item : any) => {
    return item.name?.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
  })
  else
  this.filteredCityList = JSON.parse(JSON.stringify(this.citiesList))
}
async getLocationsData() {
  this.isLoadingcitySubject.next(true)
  this.preRegistrationService.GetCityList().subscribe(
    (response:any) => {
      this.citiesList = response.value.sort((a: any, b: any) =>  a.name.localeCompare(b.name));
      this.filteredCityList = JSON.parse(JSON.stringify(this.citiesList))
      this.isLoadingcitySubject.next(false)
    },
    (error:any) => {
      this.isLoadingcitySubject.next(false)
      console.error('Error:', error);
    }
  );
  // this.unsubscribe.push(cityList);
}

private setupCountryOptions(): void {
  this.visitorForm.get('country')?.valueChanges.subscribe((val) => {
    this.stateList = [];

    this.visitorForm.patchValue({
      state: null,
      city: null,
    });

    const targetCountry = this.countriesList.find((country: any) => country.name === val?.name);

    if (targetCountry && targetCountry.states && targetCountry.states.length > 0) {
      this.stateList = targetCountry.states;
    }
  });
}

private setupStateOptions(): void {
  // this.visitorForm.get('state')?.valueChanges.subscribe((val) => {
  //   this.citiesList = [];

  //   this.visitorForm.patchValue({
  //     city: null,
  //   });

  //   // Add a null check for val
  //   if (val && val.name) {
  //     const selectedCountry = this.countriesList.find((country: any) => {
  //       return country.states.some((state: any) => state.name === val.name);
  //     });

  //     if (selectedCountry) {
  //       const selectedStateObj = selectedCountry.states.find((state: any) => state.name === val.name);

  //       if (selectedStateObj && selectedStateObj.cities) {
  //         this.citiesList = selectedStateObj.cities;
  //       }
  //     }
  //   }
  // });
}


selectHostItem() {
  this.selectedHost = this.host.value;
  this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
 }

 clearHostListItem() {
  let host = this.selectedHost ?? null;
  this.visitorForm.patchValue({ host })
  this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
 }
 filterHostList(event:any){
  const enteredData = event.target.value;
  const hostListClone = JSON.parse(JSON.stringify(this.hostlistData))
  if (!!enteredData)
  this.filteredHostList = hostListClone.filter((item : any) => {
    return item.text?.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
  })
  else
  this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
}
// onMobileNumChange() {
//   const mobileNumControl = this.fetchvisitorForm.get('mobileNum');
//   if (mobileNumControl?.errors && (mobileNumControl.errors['required'] || mobileNumControl.errors['pattern'])) {
//     this.visitorForm.reset();
//   }
// }

ngOnDestroy(): void {
  this.selectedHost = null;
  this.unsubscribe.forEach((sb) => sb.unsubscribe());
}
async presentAlert() {
  const alert = await this.alertController.create({
    header: 'Invitation',
    message: 'Invitation sent successfully',
    backdropDismiss: false,
    buttons: [{
        text: 'OK',
        handler: () => {
            this.router.navigate(['/gatekeeper/check-in-out'], { replaceUrl: true });
        }
    }]
});

await alert.present();
}

async submitOrContinue() {
  if(!this.selectedImage){
    this.presentToast("Please Select Image", 'danger');
    return
  }
  // this.isLoadingSubject.next(true);
  const splittedImgUrl = this.selectedImage.webPath?.split('/');
  const fileName = splittedImgUrl ? `${splittedImgUrl[splittedImgUrl.length - 1]}.${this.selectedImage.format}` : ''
  const res = await fetch(this.selectedImage.webPath!)
  const blob = await res.blob();
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('flag', 'visiter')
  // if (!this.visitorForm.valid) {
  //   return;
  // }
  // console.log({formData});
  
  this.errorMessage = '';
  const formControls = this.visitorForm.controls;
  // console.log("host value", formControls['host']);
  
  this.isAddLoadingSubject.next(true);

  const visitorPayload:any = {
    firstName: formControls['firstName'].value,
    lastName: formControls['lastName'].value,
    phoneNumber: formControls['phone'].value,
    email: formControls['email'].value,
    address: formControls['address'].value,
    idProof: formControls['idProof'].value,
    country: formControls['country'].value?formControls['country'].value.id:null,
    state: formControls['state'].value?formControls['state'].value.id:null,
    city: formControls['city'].value?formControls['city'].value.id:null,
    // fileName:this.fileName,
    whomToMeet:formControls['host']?.value?formControls['host']?.value.value:null,
    reason:formControls['reason']?.value?formControls['reason']?.value:null,
    category:formControls['category']?.value?formControls['category']?.value.value:0,
    OtherCategory:formControls['OtherCategory']?.value?formControls['OtherCategory']?.value:'',
    // isBlocked: formControls['blockedEntry']?.value?formControls['blockedEntry'].value:false,
    // isVIP: formControls['vipEntry']?.value?formControls['vipEntry'].value:false,
    // typeOfVIP: this.isVIPStatus ? formControls['vipStatus'].value.codeId : 0,
  };
  visitorPayload.class= 0,
  visitorPayload.division= 0,
  visitorPayload.studentName='';
  // console.log(formData,"formData",visitorPayload);
  
  this.preRegistrationService.imageUpload(formData).pipe(
    switchMap((fileUploadResponse: any) => {
      const formPayload = {
        ...visitorPayload,
        photo:fileUploadResponse.value.filePath,
        fileName:fileUploadResponse.value.fileName,
      }
    
      return this.preRegistrationService.AddVisitorDetailsByGetKeeper(formPayload);
    })
  ).subscribe(response => {
    if(response.returnNumber===200){
      // console.log('api called successfully',response);
      
      this.selectedImage=null;
      this.presentToast('Visitor Saved successfully..!', 'success');
      this.presentAlert()
      // this.router.navigate(['/', 'gatekeeper', 'dashboard'], { replaceUrl: true });
      // this.toastr.success(`visitor registered Successfully!`, 'Success', {timeOut: 3000});
    }else {
      // console.log('error', response);
      
      // this.alreadyExist=response.errorMessage
      const errorMessage = response.errorMessage;
      this.presentToast(errorMessage, 'danger');
      // this.toastr.error(this.alreadyExist, 'Error', {timeOut: 3000});
    }
    this.isAddLoadingSubject.next(false)
  },(error) => {
    // console.log('error', error);
    
    // Handle error
    this.isAddLoadingSubject.next(false)
    this.presentToast(error, 'danger');
  });
  

  // if (isNext) {
  //   const isNext = this.screeenMode === this.preReg;
    
    // const payload = {
    //   isNext,
    //   WhomMeet:formControls['host']?.value,
    //   newVisitorId:this.newVisitorId,
    //   visitorProfile:this.visitorProfile??null,
    //   ...visitorPayload
    // };
    // this.onNext.emit(payload);
    // return;
  

  // visitorPayload.fileName=this.fileName?this.fileName:this.editFileName;
  // visitorPayload.reason = '';

  // visitorPayload.whomToMeet=0;
  // visitorPayload.inviteId=0;
  
  // const visiorDataSave = this.preRegistrationService.AddVisitorDetailsByGetKeeper(visitorPayload).subscribe(
  //   (visitorResp: any) => {
  //     if (visitorResp.returnNumber===200) {
  //       // Handle successful response
  //       // this.toastr.success(`visitor Added Successfully!`, 'Success', {timeOut: 3000});
  //       // this.onClick.emit(true);
  //       // this.closeModal();
  //     }else{
  //       this.errorMessage = visitorResp.response.errorMessage;
  //       // this.toastr.error(this.errorMessage, 'Error', {timeOut: 3000});
  //     }
  //     this.isLoadingSubject.next(false)
  //   },
  //   (error: any) => {
  //     // Handle error
  //     this.isLoadingSubject.next(false)
  //     // this.toastr.error(`Error While add visitor data!`, 'Error', {timeOut: 3000});
  //     console.error('Error:', error);
  //   }
  //   );
  // this.unsubscribe.push(visiorDataSave);

  // this.selectedFile = null
  // this.touched = false;
}
}
// getVIPStatusData(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     this.visitorService.visitorStatus().subscribe(
//       (response) => {
//         // Handle successful response
//         this.vipStatusList = response.value.map((item: any) => ({          
//           name: item.text,
//           codeId: item.value,
//         }));
//         resolve();
//       },
//       (error) => {
//         // Handle error
//         console.error('Error:', error);
//         reject(error);
//       }
//     );
//   });
// }

