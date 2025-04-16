import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { PHONE_REGEX } from 'src/app/helpers/_constants';
import { PreRegistrationService } from 'src/app/services/pre-registration/pre-registration.service';
import { Router } from '@angular/router';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-pre-registration',
  templateUrl: './pre-registration.page.html',
  styleUrls: ['./pre-registration.page.scss']
})
export class PreRegistrationPage implements OnInit {
  public alertButtons = ['OK'];
  public alertInputs = [
    {
      label: 'Red',
      type: 'serchbox',
      value: 'red',
    },
    {
      label: 'Blue',
      type: 'radio',
      value: 'blue',
    },
    {
      label: 'Green',
      type: 'radio',
      value: 'green',
    },
  ];

    countriesList: any;
    unsubscribe: Subscription[] = [];
    errorMsg:string='';
    stateList: any = [];
    categorylistData :any[]=[];
    hostlistData: any[] = [];
    citiesList: any[] = [];
    newVisitorId:number = 0;
    visitorId: number = 0;
    editFileName:string='';
    editFilePath:string='';
    isVIPStatus: boolean = false;
    visitorProfile: string='';
    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    isNextLoading$: Observable<boolean>;
    isLoadingNextSubject: BehaviorSubject<boolean>;
    isFetchLoading$: Observable<boolean>;
    isLoadingFetchSubject: BehaviorSubject<boolean>;
    isSearchLoading$: Observable<boolean>;
    isLoadingSearchSubject: BehaviorSubject<boolean>;
    shouldShowCard: boolean = false;
    visitorResponse:any={};
    isDisabled: boolean = true;
    filteredHostList: any[] = [];
    searchTerm: string = '';
    // filteredHosts: any[] = [];


  // selectForm: FormGroup;  
  visitorForm: FormGroup = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    email: [''],
    address: [''],
    host: ['', Validators.required],
    reason:[null,Validators.required],
    city: [null],
    state: [null],
    country: [null],
    category:[null],
    idProof :[''],

    selectForm:[null]
    // blockedEntry: [null],
    // vipEntry: [null, Validators.required],
    // vipStatus: [null],
  });

  selectedHost: any;
  selectedRadioValue: any; // Add this variable in your component class


  get category() {
    return this.visitorForm.get('category') as FormControl
  }
  get firstName() {
    return this.visitorForm.get('firstName') as FormControl
  }
  get lastName() {
    return this.visitorForm.get('lastName') as FormControl
  }
  get phone() {
    return this.visitorForm.get('phone') as FormControl
  }
  get email() {
    return this.visitorForm.get('email') as FormControl
  }
  get address() {
    return this.visitorForm.get('address') as FormControl
  }
  get country() {
    return this.visitorForm.get('country') as FormControl
  }
  get state() {
    return this.visitorForm.get('state') as FormControl
  }
  get city() {
    return this.visitorForm.get('city') as FormControl
  }
  get host() {
    return this.visitorForm.get('host') as FormControl
  }
  get idProof() {
    return this.visitorForm.get('idProof') as FormControl
  }
  fetchvisitorForm: FormGroup = this.formBuilder.group({
    mobileNum: ['', [Validators.required, Validators.pattern(PHONE_REGEX)]],
    // blockedEntry: [''], // Ensure this matches the name in the template
    // vipEntry: [''], // Also include other form controls
    // Also include other form controls
    // ... other fo
  });

  constructor(private formBuilder: FormBuilder ,private preRegistrationService: PreRegistrationService, private router: Router,private toastController: ToastController ,private alertController: AlertController,private popoverController :PopoverController) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);  this.isLoading$ = this.isLoadingSubject.asObservable();
    this.isLoadingNextSubject = new BehaviorSubject<boolean>(false);  this.isNextLoading$ = this.isLoadingNextSubject.asObservable();
    this.isLoadingFetchSubject = new BehaviorSubject<boolean>(false);  this.isFetchLoading$ = this.isLoadingFetchSubject.asObservable();
    this.isLoadingSearchSubject = new BehaviorSubject<boolean>(false);  this.isSearchLoading$ = this.isLoadingSearchSubject.asObservable();
    this.category.disable();
    this.firstName.disable()
    this.lastName.disable()
    this.phone.disable()
    this.email.disable()
    this.idProof.disable()
    this.address.disable()
    this.country.disable()
    this.state.disable()
    this.city.disable()
    
   }

   onRadioSelect(host: any) {
    this.selectedRadioValue = host; // Update the selected value when a radio button is selected
  }

   selectHostItem() {
    this.selectedHost = this.host.value;
    // console.log('this.filteredHostList-select', this.filteredHostList);
    
    this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
   }

   clearHostListItem() {
    let host = this.selectedHost ?? null;
    this.visitorForm.patchValue({ host })
    // console.log('this.filteredHostList', this.filteredHostList);
    
    this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
   }

  ngOnInit() {
    // this.preRegistrationService.getVisitorCountryStateCityList().subscribe();
    this.getHostDrop();
    this.getCategoryListData();
    this.getLocationsData();
    this.setupCountryOptions();
    this.setupStateOptions();
  }
  ionViewWillLeave(){
    this.selectedHost = null;
    this.shouldShowCard =false
    this.visitorForm.reset();
    this.fetchvisitorForm.reset()
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

  fetchVisitor() {
    const { mobileNum } = this.fetchvisitorForm.value;
    this.isLoadingFetchSubject.next(true);
    this.preRegistrationService.GetVisitorDetailsByPhoneNumber(mobileNum).subscribe((res)=>{
      this.isLoadingFetchSubject.next(false);
      if (res.response.returnNumber===404 || res.response.returnNumber===401 ) {
       
        this.router.navigate(['/gatekeeper/pre-registration/register-checkin', {mobileNum: mobileNum}]);

        this.visitorForm.reset();
        this.errorMsg=res.response.errorMessage || '';
        this.presentToast(this.errorMsg, 'danger');

        // this.toastr.error(this.errorMsg, 'Error', {timeOut: 3000});
      }else if(res.response.returnNumber===200){
        this.errorMsg='';
        // const visitorId = res.value.visitorId;
        this.visitorId = res.value.visitorId;
        this.visitorProfile = res.value.fileName;
        this.visitorResponse=res.value
        // console.log('visitorResponse', this.visitorResponse, this.visitorResponse.fileName);
        
        this.presentToast('Visitor Fetched Successfully!', 'success');
        // this.toastr.success('Visitor Fetched Successfully!', 'Success', {timeOut: 3000});
        this.getVisitorData(this.visitorId);
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
            phone: response.value.phoneNumber,
            email: response.value.email || '',
            address: response.value.address || '',
            idProof:response.value.idProof,
            category: response.value?.category?this.getCategoryName(response.value?.category):null, 
            city: response.value?.city?this.getCityName(response.value?.city):null,
            // country: response.value?.country?this.getCountryName(response.value?.country):null,
            // state: response.value?.state?this.getStateName(response.value?.state):null,
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

  getCategoryName(categoryId: number): string {
    const category = this.categorylistData.find((c:any) => c.value === String(categoryId));
    return category ? category : '';
  }

  // getCountryName(countryId: number): string {
  //   const country = this.countriesList.find((c:any) => c.id === countryId);
  //   return country ? country : '';
  // }

  // getStateName(stateId: number): string {
  //   const state = this.countriesList.reduce((acc:any, cur:any) => [...acc, ...cur.states], []).find((s : any) => s.id === stateId);
  //   return state ? state : '';
  // }

  getCityName(cityId: number): string {
    console.log(cityId,"id");
    const city = this.citiesList.find((c:any) => c.id == String(cityId));
    return city ? city : '';
  }

  handleImageError(event:any){
    event.target.src='https://ionicframework.com/docs/img/demos/avatar.svg';
  }
  async sendInvite(){
    this.isLoadingNextSubject.next(true);
    const formControls = this.visitorForm.controls;

    const visiorData = {
      visitorId: this.visitorId,
      whomToMeet:formControls['host']?.value.value,
      reason:formControls['reason']?.value,
    }
    this.preRegistrationService.AddVisitOfPreRegisteredVisitorByGetKeeper(visiorData).subscribe(async (res)=>{
      if (res.returnNumber===200) {
      this.presentToast('visitor registered Successfully!', 'success');
      // this.shouldShowCard =true
      this.isLoadingNextSubject.next(false);
      const alert = await this.alertController.create({
        header: 'Invitation',
        message: 'Invitation sent successfully',
        backdropDismiss: false,
        buttons: [{
            text: 'OK',
            handler: () => {
                this.router.navigate(['/gatekeeper/dashboard'], { replaceUrl: true });
            }
        }]
      });
      await alert.present();

        // this.toastr.success(`visitor registered Successfully!`, 'Success', {timeOut: 3000});
      }else{
        this.presentToast(res.response.errorMessage, 'danger');
        this.isLoadingNextSubject.next(false);
      }
      
    },
    (error) => {
      // Handle error
      this.isLoadingNextSubject.next(false);
      this.presentToast('Error While register visitor data!', 'danger');

      // this.toastr.error(`Error While register visitor data!`, 'Error', {timeOut: 3000});
    })

    // this.shouldShowCard = false
    this.visitorForm.reset();
    this.fetchvisitorForm.reset();

    // this.router.navigate(['/gatekeeper/check-in-out'], {replaceUrl: true});
  }
  onNextClick() {
    if (this.visitorForm.invalid || this.fetchvisitorForm.invalid ) {
         
      Object.values(this.visitorForm.controls).forEach(control => {
        control.markAsTouched();
      });
      Object.values(this.fetchvisitorForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      return;
    }
    const formControls = this.visitorForm.controls;

    const visiorData = {
      visitorId: this.visitorId,
      whomToMeet:formControls['host']?.value.value,
      reason:formControls['reason']?.value,
    }

      this.visitorResponse.whomToMeet = this.getWhomeTomeetName(visiorData.whomToMeet)
      this.shouldShowCard =true
  }
  getWhomeTomeetName (id:any){
    return this.hostlistData.find(host=>host.value==id).text;
  }

  async getLocationsData() {
    this.preRegistrationService.GetCityList().subscribe(
      (response:any) => {
       
        this.citiesList = response.value;
      },
      (error : any) => {
        console.error('Error:', error);
      } 
    );
    // this.unsubscribe.push(cityList);
  }


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


  getHostDrop(): any {
    this.isLoadingSearchSubject.next(true)
    const hostList = this.preRegistrationService.whooomeToMeetList().subscribe(
      (response) => {
        
        this.hostlistData = response.value.sort((a: any, b: any) =>  a.text.localeCompare(b.text));
        this.filteredHostList = JSON.parse(JSON.stringify(this.hostlistData))
        this.isLoadingSearchSubject.next(false)
      },
      (error) => {
        this.isLoadingSearchSubject.next(false)
        console.error('Error:', error);
      }
    );
    this.unsubscribe.push(hostList);
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

  // onMobileNumChange() {
  //   const mobileNumControl = this.fetchvisitorForm.get('mobileNum');
  //   if (mobileNumControl?.errors && (mobileNumControl.errors['required'] || mobileNumControl.errors['pattern'])) {
  //     this.visitorForm.reset();
  //   }
  // }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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




}
