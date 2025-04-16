import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CheckInOutService } from '../services/checkinout/check-in-out.service';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, timeout } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// const scanImg = require('../../assets/icon/Vector.png');
// import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Html5Qrcode } from 'html5-qrcode';

import { FilePicker } from '@capawesome/capacitor-file-picker';
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.page.html',
  styleUrls: ['./check-out.page.scss'],
})
export class CheckOutPage implements OnInit {

  @ViewChild('qrReaderResults') qrReaderResults!: ElementRef;
  private API_IMAGE = `${environment.apiUrl}/File/Download`;
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedOption: string = 'qrCode'; // Default value
  visitor: any = {}
  countrydata: any
  invite: any = {};
  inputType: string = 'qr'; // Default value
  userInfo: any;
  isGetVisitorSuccessResponseByText: boolean = false;
  isGetVisitorSuccessResponseByQR: boolean = false;
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;

  qrResult: any = {}
  pdfDocGenerator: any;
  currentDate: Date = new Date();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  passPrintLoading$: Observable<boolean>;
  passPrintLoadingSubject: BehaviorSubject<boolean>;
  checkInLoading$: Observable<boolean>;
  checkInLoadingSubject: BehaviorSubject<boolean>;
  QrcodeImage: any;
  errorMessage: string = '';
  isError: boolean = false;
  qrCodeData: any;
  qrCodeScannerStatus: boolean = false;
  getDeviceID: any
  html5QrCode: any;
  cameraOption: number = 0;
  showimagefile :boolean = true
  showcameraOption: boolean = false;

  inviteCode: string = '';
  has_cert: boolean = false;
  checkOutLoading$: Observable<boolean>;
  checkOutLoadingSubject: BehaviorSubject<boolean>;
  visitorDetailsLoading$: Observable<boolean>;
  visitorDetailsLoadingSubject: BehaviorSubject<boolean>;
  isSupported: boolean = false;
  constructor(private QrService: CheckInOutService, private toastr: ToastrService, private router: Router, private toastController: ToastController, private alertController: AlertController) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.passPrintLoadingSubject = new BehaviorSubject<boolean>(false);
    this.passPrintLoading$ = this.passPrintLoadingSubject.asObservable();

    this.checkInLoadingSubject = new BehaviorSubject<boolean>(false);
    this.checkInLoading$ = this.checkInLoadingSubject.asObservable();

    this.checkOutLoadingSubject = new BehaviorSubject<boolean>(false);
    this.checkOutLoading$ = this.checkOutLoadingSubject.asObservable();

    this.visitorDetailsLoadingSubject = new BehaviorSubject<boolean>(false);
    this.visitorDetailsLoading$ = this.visitorDetailsLoadingSubject.asObservable();
  }


  // async ionViewDidEnter() {
  //   BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (scannModule) => {
  //     if (!scannModule.available) {
  //       await BarcodeScanner.installGoogleBarcodeScannerModule();
  //     }
  //   }).catch((e) => {
  //     this.presentToast(`${e}`, 'danger')
  //   });
  //   BarcodeScanner.isSupported().then((result) => {
  //     this.isSupported = result.supported;
  //   }).catch((e) => {
  //     this.presentToast(`${e}`, 'danger')
  //   });
  // }

  async ionViewWillLeave() {
    this.visitor = {}
    this.qrResult = {};
    this.isGetVisitorSuccessResponseByQR = false
    this.isGetVisitorSuccessResponseByText = false
    this.inviteCode = ''
    this.showcameraOption =false
    this.stopScanner()
    
    // await BarcodeScanner.stopScan();
  }

  ngOnInit() {
    this.userInfo = localStorage.getItem(this.authLocalStorageToken);
    this.userInfo = JSON.parse(this.userInfo)
    this.GetUnplannedVistListUserSide()
  }

  startScanner() {  
    this.isGetVisitorSuccessResponseByQR = false
    this.showcameraOption=true
    this.qrCodeData = null;
    this.qrCodeScannerStatus = true;
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        this.getDeviceID = devices;
        this.html5QrCode = new Html5Qrcode("readerout");
        this.html5QrCode.start(
          { facingMode: { exact: "environment"} },{ fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: any, decodedResult: any) => {
            this.qrCodeData = decodedResult;
            this.html5QrCode.stop();
            this.onScanSuccess(decodedText, decodedResult);
            console.log(this.qrCodeData);
          },
          (errorMessage: any) => {
            console.log(errorMessage);
          })
          .catch((err: any) => {
            console.log(err);
          }
          );
      }
    }).catch(err => {
      console.log(err);
    });
  }
  openFileInput() {
    this.qrCodeData=null
    this.qrCodeScannerStatus =true
    this.isGetVisitorSuccessResponseByQR = false
    this.fileInput.nativeElement.click();
  }
  async onFileSelected(event: any) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const imageDataUrl = e.target.result;
      this.decodeQRCode(imageDataUrl, file);
    };
    reader.readAsDataURL(file);
  
  }
  async decodeQRCode(dataUrl: string, imageFile: File) {
    this.html5QrCode = new Html5Qrcode("readerout");
    try {
      const qrCodeData = await this.html5QrCode.scanFile(imageFile, false);
      console.log('canvasElement', this.html5QrCode.canvasElement);
      this.showcameraOption=false
      
      if (qrCodeData) {
        this.onScanSuccess(qrCodeData);
      } else {
        console.log('QR code not found in the image.');
      }
    } catch (error) {
      console.error('Error decoding QR code:', error);
    }
  }
  onScanSuccess(decodedText: string, decodedResult?: any) {
    let splitCode = decodedText.split('&');
    let visitorId = splitCode[0].split('=')[1];
    let inviteId = splitCode[1].split('=')[1];

    this.qrResult = { visitorId, inviteId }
    //     // Fetch visitor data
    this.isGetVisitorSuccessResponseByQR = false;
    if (visitorId && inviteId) {
      this.isGetVisitorSuccessResponseByQR = true;
      this.getVisitorData(visitorId);
      this.getInviteData(inviteId);
    }
  }
  ngOnDestroy() {
    this.stopScanner();
  }

  stopScanner() {
    this.showcameraOption=false
    // this.qrCodeData = null;
    this.qrCodeScannerStatus = true;
    this.getDeviceID = null;
    this.html5QrCode.stop();
    this.cameraOption = 0;
  }
  selectCameraOption(data:any){
    this.cameraOption = data;
    this.html5QrCode.stop();
    this.startScanner();
    //console.log(data);
  }
  getVisitorData(visitorId: any) {
    this.visitorDetailsLoadingSubject.next(true);
    this.QrService.GetVisitorDetailsById(visitorId).subscribe(
      (response) => {

        if (response.value &&Object.keys(response.value).length > 0) {
          this.showcameraOption=false
          this.countrydata = response.value;
          this.errorMessage = '';
          this.isError = false; // No error
          // Update UI with visitor details
          this.updateVisitorDetails(response.value);

        } else {
          const errorMessage = response.response.errorMessage;
          this.presentToast(errorMessage, 'danger');
          this.isError = true;
        }
        this.visitorDetailsLoadingSubject.next(false);
      },
      (error) => {
        this.visitorDetailsLoadingSubject.next(false);
        console.error('Error:', error);
        this.isError = true;
      }
    );
  }

  getInviteData(inviteId: any) {
    this.visitorDetailsLoadingSubject.next(true);
    this.QrService.GetInviteDetailsById(inviteId).subscribe(
      (response) => {

        if (Object.keys(response.value).length > 0) {
          this.showcameraOption=false
          const countryList: any = this.QrService.countryList.getValue();
          this.countrydata = countryList.find((c: any) => c.id === response.value.country)
          // Update UI with visitor details
          this.invite = response.value;

        } else {
          const errorMessage = response.response.errorMessage;
          this.presentToast(errorMessage, 'danger');
        }
        this.visitorDetailsLoadingSubject.next(false);
      },
      (error) => {
        this.visitorDetailsLoadingSubject.next(false);
        console.error('Error:', error);
      }
    );
  }

  updateVisitorDetails(visitorDetails: any) {
    this.visitor = { ...visitorDetails };
  }

  getInvitecode() {
    this.isLoadingSubject.next(true);
    this.isGetVisitorSuccessResponseByText = false;
    this.QrService.GetVisitorDetailsByInvitecode(this.inviteCode).subscribe(
      (response: any) => {
        if (response.response.returnNumber == 200) {
          this.isGetVisitorSuccessResponseByText = true;
          this.QrcodeImage = response.value.url;

          this.qrResult = response.value
          this.getVisitorData(this.qrResult.visitorId);
          this.getInviteData(this.qrResult.inviteId);
          this.presentToast('Invite Code fetched', 'success');
          // this.toastr.success(`Invite Code fetched`, 'Success', {timeOut: 3000});
        } else {
          this.isGetVisitorSuccessResponseByText = false;
          const errorMessage = response.response.errorMessage;
          // this.toastr.error(errorMessage, 'Error', {timeOut: 3000});
          this.presentToast(errorMessage, 'danger');
          this.qrResult = {}
        }
        this.isLoadingSubject.next(false);
      },
      (error) => {
        this.isGetVisitorSuccessResponseByText = false;
        console.error('Check-in failed:', error);
        this.presentToast('failed to get code', 'danger');
        // this.toastr.error(`failed to get code`, 'Error', {timeOut: 3000});
        this.isLoadingSubject.next(false);
      }
    )
  }

  checkOut() {
    this.checkOutLoadingSubject.next(true);
    // Extract visitorId and inviteId from qrResult
    const { visitorId, inviteId } = this.qrResult;
    const combinedId = `${visitorId},${inviteId}`;
    // Call the CheckInVisitByQR API with visitorId and inviteId
    this.QrService.CheckOutVisitByQR(visitorId, inviteId).subscribe(
      (response: any) => {

        if (response.returnNumber == 200) {
          this.presentToast(`Checked Out Successfully`, 'success');
          this.router.navigate(['/gatekeeper/dashboard']);
        } else {
          const errorMessage = response.errorMessage;
          this.presentToast(errorMessage, 'danger');
        }
        this.checkOutLoadingSubject.next(false);
      },
      (error) => {

        console.error('Check-out failed:', error);
        this.checkOutLoadingSubject.next(false);
        this.presentToast(`Check-out failed`, 'danger');
        // if (error && error.error && error.error[' ']) {
        //     const errorMessage = error.error[' '];
        //     console.error('Error message:', errorMessage);
        //     this.errorMessage = errorMessage;
        // }
      }
    );

  }

  GetUnplannedVistListUserSide() {
    // this.QrService.GetUnplannedVistListUserSide().subscribe((res)=>{
    //   if (res.value?.length>0) {
    //     this.unPlannedList = res.value.map(item => ({ firstName: item.firstName, lastName: item.lastName,inviteId: item.inviteId,isUnplannedAccepted:item.isUnplannedAccepted }));
    //   }
    // })
  }

  // async scan(): Promise<void> {
  //   const granted = await this.requestPermissions();
  //   if (!granted) {
  //     this.presentAlert();
  //     return;
  //   }
  //   BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (scannModule) => {
  //     if (!scannModule.available) {
  //       await BarcodeScanner.installGoogleBarcodeScannerModule();
  //     }
  //   }).catch((e) => {
  //     this.presentToast(`${e}`, 'danger')
  //     console.log('err: ', e)
  //   });

  //   BarcodeScanner.scan({
  //     formats: [BarcodeFormat.QrCode],
  //   }).then((res) => {
  //     this.onScanSuccessResult(res.barcodes);
  //   }).catch((e) => {
  //     this.presentToast(`${e}`, 'danger')
  //     this.onScanFailureResult();
  //   })
  // }



  // async requestPermissions(): Promise<boolean> {
  //   const { camera } = await BarcodeScanner.requestPermissions();
  //   return camera === 'granted' || camera === 'limited';
  // }

  // async presentAlert(): Promise<void> {
  //   const alert = await this.alertController.create({
  //     header: 'Permission denied',
  //     message: 'Please grant camera permission to use the barcode scanner.',
  //     buttons: ['OK'],
  //   });
  //   await alert.present();
  // }

  // async onScanSuccessResult(barcodes: any) {
  //   this.visitor = {};
  //   if (barcodes.length > 0 && barcodes[0].valueType == "TEXT") {
  //     let splitCode = barcodes[0].rawValue.split('&');
  //     let visitorId = splitCode[0].split('=')[1];
  //     let inviteId = splitCode[1].split('=')[1];

  //     this.qrResult = { visitorId, inviteId }
  //     //     // Fetch visitor data
  //     this.isGetVisitorSuccessResponseByQR = false;
  //     if (visitorId && inviteId) {
  //       this.isGetVisitorSuccessResponseByQR = true;
  //       this.getVisitorData(visitorId);
  //       this.getInviteData(inviteId);
  //     }
  //   } else {
  //     this.presentToast('Please scan valid qrCode', 'danger')
  //   }
  //   await BarcodeScanner.stopScan();
  // }

  // async onScanFailureResult() {
  //   this.qrResult = {};
  //   await BarcodeScanner.stopScan();
  // }

  // public async readBarcodeFromImage(): Promise<void> {
  //   const { files } = await FilePicker.pickImages({ limit: 1 });
  //   const path = files[0]?.path;
  //   if (!path) {
  //     return;
  //   }

  //   const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
  //     path,
  //   });
  //   this.onScanSuccessResult(barcodes);
  // }
  handleImageError(event:any){
    event.target.src='https://ionicframework.com/docs/img/demos/avatar.svg';
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

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/gatekeeper/dashboard']);
  }

}
