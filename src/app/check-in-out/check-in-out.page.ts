import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CheckInOutService } from '../services/checkinout/check-in-out.service';
// import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { Camera } from '@capacitor/camera';

// import { FilePicker } from '@capawesome/capacitor-file-picker';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
// pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.page.html',
  styleUrls: ['./check-in-out.page.scss'],
})
export class CheckInOutPage implements OnInit {
  [x: string]: any;
  @ViewChild('qrReaderResults') qrReaderResults!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  private API_IMAGE = `${environment.apiUrl}/File/Download`;

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
  visitorDetailsLoading$: Observable<boolean>;
  visitorDetailsLoadingSubject: BehaviorSubject<boolean>;
  QrcodeImage: any;

  inviteCode: string = '';
  has_cert: boolean = false;
  isSupported: boolean = false;
  errorMessage: string = '';
  isError: boolean = false;

  qrCodeData: any;
  qrCodeScannerStatus: boolean = false;
  getDeviceID: any
  html5QrCode: any;
  cameraOption: number = 0;
  showimagefile :boolean = true
  showcameraOption: boolean = false;

  constructor(private QrService: CheckInOutService, private toastr: ToastrService, private router: Router, private toastController: ToastController, private alertController: AlertController) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.passPrintLoadingSubject = new BehaviorSubject<boolean>(false);
    this.passPrintLoading$ = this.passPrintLoadingSubject.asObservable();

    this.checkInLoadingSubject = new BehaviorSubject<boolean>(false);
    this.checkInLoading$ = this.checkInLoadingSubject.asObservable();
    this.visitorDetailsLoadingSubject = new BehaviorSubject<boolean>(false);
    this.visitorDetailsLoading$ = this.visitorDetailsLoadingSubject.asObservable();
  }

  async ionViewDidEnter() {
    // this.installBarcodeScannerModule()
  }

  async ionViewWillLeave() {
    this.visitor = {}
    this.qrResult = {};
    this.isGetVisitorSuccessResponseByQR = false
    this.isGetVisitorSuccessResponseByText = false
    this.inviteCode = ''
    this.showcameraOption = false
    this.stopScanner()
    
    // await BarcodeScanner.stopScan();
  }

  ngOnInit() {
    this.userInfo = localStorage.getItem(this.authLocalStorageToken);

    this.userInfo = JSON.parse(this.userInfo)
    this.GetUnplannedVistListUserSide()
    // this.installBarcodeScannerModule()
  }

  // async installBarcodeScannerModule() {
  //   BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (scannModule) => {
  //     if (!scannModule.available) {
  //       await BarcodeScanner.installGoogleBarcodeScannerModule();
  //     }
  //   }).catch((e) => {
  //     this.presentToast(`${e}`, 'danger')
  //   });
    // BarcodeScanner.isSupported().then((result) => {
    //   this.isSupported = result.supported;
    // }).catch((e) => {
    //   this.presentToast(`${e}`, 'danger')
    // });
  // }

  handleImageError(event: any) {
    event.target.src = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  }

  startScanner() {
    alert("test")
    this.isGetVisitorSuccessResponseByQR = false
    this.showcameraOption=true
    this.qrCodeData = null;
    this.qrCodeScannerStatus = true;
    Html5Qrcode.getCameras().then(devices => {
      alert(`${devices}:testttt`)
      if (devices && devices.length) {
        alert("readerin 2")
        this.getDeviceID = devices;
        this.html5QrCode = new Html5Qrcode("readerin");
        alert("readerin")
        this.html5QrCode.start(
          { facingMode: { exact: "environment"} }, { fps: 10, qrbox: { width: 250, height: 250 } },
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

  // async startScanner() {
  //   // 1. Check if the browser supports camera access
  //   if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  //     this.presentToast("Your browser doesn't support camera access or the page is not secure (needs HTTPS/localhost)", "danger");
  //     return;
  //   }
  
  //   this.isGetVisitorSuccessResponseByQR = false;
  //   this.showcameraOption = true;
  //   this.qrCodeData = null;
  //   this.qrCodeScannerStatus = true;
  
  //   try {
  //     // 2. Check for available cameras
  //     const devices = await Html5Qrcode.getCameras();
  //     if (!devices || devices.length === 0) {
  //       this.presentToast("No cameras found on this device", "danger");
  //       return;
  //     }
  
  //     // 3. Initialize Html5Qrcode
  //     this.html5QrCode = new Html5Qrcode("readerin");
  
  //     // 4. Select camera (prefer rear camera if available)
  //     const cameraId = devices[0].id; // Default to first camera
  //     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //     const cameraConfig = isMobile
  //       ? { facingMode: "environment" } // Prefer rear camera on mobile
  //       : { deviceId: { exact: cameraId } }; // Use specific camera ID on desktop
  
  //     // 5. Start QR code scanning
  //     await this.html5QrCode.start(
  //       cameraConfig,
  //       {
  //         fps: 10,
  //         qrbox: { width: 250, height: 250 },
  //         supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
  //       },
  //       (decodedText: any, decodedResult: any) => {
  //         this.onScanSuccess(decodedText, decodedResult);
  //       },
  //       (error: any) => {
  //         console.warn("QR scan error:", error);
  //         // Avoid spamming errors; only show critical ones
  //       }
  //     );
  //   } catch (err) {
  //     this.handleCameraError(err);
  //   }
  // }
  
  handleCameraError(error: any) {
    console.error("Camera Error:", error);
    let message = "An error occurred while accessing the camera";
    
    if (error.name === "NotAllowedError") {
      message = "Please allow camera permissions in your browser settings";
    } else if (error.name === "NotFoundError" || error.message.includes("No cameras")) {
      message = "No camera found on this device";
    } else if (error.name === "NotReadableError") {
      message = "Camera is already in use by another application";
    } else {
      message = `Camera error: ${error.message}`;
    }
  
    this.presentToast(message, "danger");
    this.qrCodeScannerStatus = false;
    this.showcameraOption = false;
  }

// handleCameraError(error:any) {
//     console.error("Camera Error:", error);
    
//     if (error.name === "NotAllowedError") {
//         alert("Please allow camera permissions in your browser settings");
//     } 
//     else if (error.name === "NotFoundError" || error.message.includes("No cameras")) {
//         alert("No camera found on this device");
//     }
//     else {
//         alert("Camera error: " + error.message);
//     }
// }

  
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
    this.html5QrCode = new Html5Qrcode("readerin");
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

  checkIn() {
    this.checkInLoadingSubject.next(true);
    // Extract visitorId and inviteId from qrResult
    const { visitorId, inviteId } = this.qrResult;
    const combinedId = `${visitorId},${inviteId}`;

    // Call the CheckInVisitByQR API with visitorId and inviteId
    this.QrService.CheckInVisitByQR(visitorId, inviteId).subscribe(
      (response: any) => {
        if (response.returnNumber == 200) {
          this.presentToast('Checked In Successfully!', 'success');
          this.qrResult = {}
          // this.toastr.success(`Checked In Successfully!`, 'Success', {timeOut: 3000});
        } else {
          const errorMessage = response.errorMessage;
          this.presentToast(errorMessage, 'danger');
          // this.toastr.error(errorMessage, 'Error', {timeOut: 3000});
        }
        this.checkInLoadingSubject.next(false);
      },
      (error) => {
        this.checkInLoadingSubject.next(false);
        console.error('Check-in failed:', error);
        this.presentToast('Check-in failed:', 'danger');

        // this.toastr.error(`Check-in failed:`, 'Error', {timeOut: 3000});
        // if (error && error.error && error.error[' ']) {
        //     const errorMessage = error.error[' '];
        //     console.error('Error message:', errorMessage);
        //     this.errorMessage = errorMessage;
        // }
      }
    );
  }
  

  onGeneratePass() {
    this.passPrintLoadingSubject.next(true);
    var datePipe = new DatePipe('en-us');
    const visitorCardDefinition: any = {
      pageSize: 'A5', // Set the page size
      pageOrientation: 'portrait',
      pageMargins: [40, 10, 40, 10], // Adjust margins as needed
      content: [
        {
          absolutePosition: { x: 40, y: 20 },
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 340, // Width of A4 page in PDFMake (in points)
              h: 550, // Height of A4 page in PDFMake (in points)
              r: 10, // Radius for rounded corners (if needed)
              lineWidth: 2, // Border width
              lineColor: '#000000', // Border color
            },
          ],
        },
        {
          columns: [
            [{ image: 'logo', width: 40, height: 40, margin: [0, 15, 0, 10], alignment: 'center' }],
          ],
        },
        { text: `${this.userInfo.value.schooName}`, alignment: 'center', style: 'schoolName' },
        {
          columns: [
            ['\n', { text: '\t\t\tE - PASS\t\t\t', style: 'visitorCard' }, '\n'],
          ],
        },
        {
          columns: [
            ['\n', { image: 'visitor', width: 70, height: 70, alignment: 'center' },],
          ],
        },
        {
          margin: [20, 0], // Adding margin top and bottom, adjust as needed
          columns: [
            [
              '\n',
              { text: 'Name', style: 'text' },
              '\n',
              // { text: 'From', style: 'text' },
              // '\n',
              { text: 'To Meet', style: 'text' },
              '\n',
              { text: 'Purpose', style: 'text' },
              '\n',
              { text: 'Time In', style: 'text' },
              '\n',
              { text: 'Phone', style: 'text' },
              // '\n',
              // {
              //   text: 'VALIDITY',
              //   style: 'text',
              // },
            ],
            [
              '\n',
              { text: `${this.visitor.firstName} ${this.visitor.lastName}`, style: 'text' },
              '\n',
              // { text: '-', style: 'text' },
              // '\n',
              { text: `${this.invite.whomToMeetName || '-'}`, style: 'text' },
              '\n',
              { text: `${this.invite.purpose || '-'}`, style: 'text' },
              '\n',
              { text: `${datePipe.transform(this.invite.expectedCheckinTime ? this.invite.expectedCheckinTime : this.currentDate, 'dd-MM-yyyy hh:mm')}`, style: 'text' },
              '\n',
              { text: `${this.visitor.phoneNumber}`, style: 'text' },
              // '\n',
              // {
              //   text: `${datePipe.transform(this.invite.expectedCheckoutTime ? this.invite.expectedCheckoutTime : this.currentDate.setMinutes(this.currentDate.getMinutes() + 15), 'dd-MM-yyyy hh:mm')}`,
              //   style: 'text',
              // },
            ],
          ]
        },
        {
          columns: [
            ['\n', { image: 'Qrcode', width: 80, height: 80, alignment: 'center' }],
          ],
        },
        {
          margin: [10, 60, 0, 0],
          columns: [
            [
              {
                text: 'VISITOR SIGN',
                style: 'text',
              },
            ],
            [
              {
                text: 'EMPLOYEE SIGN',
                style: 'text',
              },
            ],
            [
              {
                text: 'SECURITY OFFICER',
                style: 'text',
              },
            ],
          ],
        },
      ],

      styles: {
        visitorCard: {
          padding: 50,
          fontSize: 20,
          bold: true,
          alignment: 'center',
          background: 'green',
          color: 'white',
        },
        schoolName: {
          padding: 0,
          fontSize: 20,
          bold: true,
          color: 'black'
        },
        text: { fontSize: 12, alignment: 'left', bold: true },
        column: { alignment: 'center' },
      },
      images: {
        logo: 'https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/07/opener-w-Bugatti-3.webp?size=*:675', // Static placeholder URL for logo
        visitor: 'https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/07/opener-w-Bugatti-3.webp?size=*:675', // Static placeholder URL for visitor image
        Qrcode: 'https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/07/opener-w-Bugatti-3.webp?size=*:675', // Static placeholder URL for QR code
      },
      // images: {
      //   logo: this.userInfo.value.url,
      //   visitor: `${this.API_IMAGE}/${this.visitor?.fileName}`,
      //   Qrcode: this.invite.qrCodeUrl
      // },
    };
    // this.pdfDocGenerator = pdfMake.createPdf(visitorCardDefinition, {}, undefined, pdfFonts.pdfMake.vfs);
    this.pdfDocGenerator = pdfMake.createPdf(visitorCardDefinition, {}, undefined, pdfFonts.vfs);
    // Convert the PDF document to a data URI
    this.pdfDocGenerator.getBlob(async (res: Blob) => {
      const url = window.URL.createObjectURL(res);
      window.open(url, '_blank');
    });
    this.passPrintLoadingSubject.next(false);
  }
  GetUnplannedVistListUserSide() {
    // this.QrService.GetUnplannedVistListUserSide().subscribe((res)=>{
    //   if (res.value?.length>0) {
    //     this.unPlannedList = res.value.map(item => ({ firstName: item.firstName, lastName: item.lastName,inviteId: item.inviteId,isUnplannedAccepted:item.isUnplannedAccepted }));
    //   }
    // })
  }

  // async scan(): Promise<void> {
  //   const permission = await this.checkPermissions();
  //   if (!permission) {
  //     const granted = await this.requestPermissions();
  //     if (!granted) {
  //       this.presentAlert();
  //       return;
  //     }
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

  // async checkPermissions(): Promise<boolean> {
  //   const { camera } = await BarcodeScanner.checkPermissions();
  //   return camera === 'granted' || camera === 'limited';
  // }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

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
  //   console.log("readonly");

  //   const { files } = await FilePicker.pickImages({ limit: 1 });
  //   console.log(files, "files");
  //   const path = files[0]?.path;
  //   console.log(path, "path");
  //   if (!path) {
  //     return;
  //   }


  //   const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
  //     path,
  //   });

  //   this.onScanSuccessResult(barcodes);
  // }

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
