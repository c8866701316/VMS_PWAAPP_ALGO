import { Component, OnInit, ViewChild } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckInOutService } from '../services/checkinout/check-in-out.service';
import { AlertController, IonicSafeString, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {
  private presentedAlert: HTMLIonAlertElement | null = null;
  @ViewChild('modal') modal: any;
  visitorDetails: any = null;
  checkingdata :any
  response500 :any
  currentCamera: any;
  name:any;
  isUsingBackCamera: boolean = true;
  private html5QrCode: Html5Qrcode | null = null;
  qrResult: any = {}
  checkInLoading$: Observable<boolean>;
  isloading:boolean =true 
  checkInLoadingSubject: BehaviorSubject<boolean>;
  alertMessage: string = '';
  imageURL :string =''
  customContent: any
  constructor(private QrService: CheckInOutService,private toastController: ToastController,private alertController: AlertController,private loadingController: LoadingController,private modalCtrl: ModalController) {
    this.checkInLoadingSubject = new BehaviorSubject<boolean>(false);
    this.checkInLoading$ = this.checkInLoadingSubject.asObservable();
  }
  ngOnInit() {
    this.startQrCodeScanner()
  }
  handleImageError(event:any){
    event.target.src='https://ionicframework.com/docs/img/demos/avatar.svg';
    event.target.style.width="100px",
    event.target.style.borderRadius="50%"
    event.target.style.height="100px"
    event.target.style.padding="3px"
  }
 
  setResult(ev:any) {
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

  
  startQrCodeScanner() {
    if (!this.html5QrCode) {
      this.html5QrCode = new Html5Qrcode("reader");
    }

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const getBackCameraIndex = devices.findIndex(x => x.label.includes('back'))
        this.currentCamera = this.isUsingBackCamera ? devices[0] : devices[getBackCameraIndex] || devices[0]; 
        this.html5QrCode?.start(
          this.currentCamera.id,
          {
            fps: 10,
            qrbox: 250
          },
          qrCodeMessage => {
            const visitorId = qrCodeMessage.split('&')[0];
            const inviteId = qrCodeMessage.split('&')[1];
            const indexId = visitorId.split('=')[1];
            const inviteNum = inviteId.split('=')[1];
            this.qrResult = { indexId, inviteNum };
            this.checkIn();
            this.stopQrCodeScanner();
          },
          errorMessage => {
            console.warn(`QR Code scan error: ${errorMessage}`);
          }
        ).catch(err => {
          console.error("Error starting QR Code scanner:", err);
        });
      }
    }).catch((err:any) => {
      console.error("Error getting cameras:", err);
    });
  }

  toggleCamera() {
    this.stopQrCodeScanner(); 
    this.isUsingBackCamera = !this.isUsingBackCamera; 
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        this.currentCamera = this.isUsingBackCamera ? devices[0] : devices[1] || devices[0]; 
        this.startQrCodeScanner(); 
      }
    }).catch(err => {
      console.error("Error getting cameras:", err);
    });
  }
  getVisitorDetailsByVisitorId(visitorId: any) {
    // Replace with the actual API call
    this.QrService.GetVisitorDetailsById(visitorId).subscribe(
      (response) => {
        const res = JSON.stringify(response)
        if (res) {
          this.visitorDetails = response.value;
          this.checkIn();
        } else {
          const errorMessage = response.response.errorMessage;
          this.presentToast(errorMessage, 'danger');
          }
          },
          (error) => {
        console.error('Error:', error);
      }
    );
  }

  async  checkIn() {
    this.checkInLoadingSubject.next(true);
    const { indexId, inviteNum } = this.qrResult;
    const combinedId = `${indexId},${inviteNum}`;
    // Call the CheckInVisitByQR API with visitorId and inviteId
    this.QrService.CheckInVisitByQR(indexId, inviteNum).subscribe(
      (response: any) => {
        if (response.returnNumber == 200) {
          this.response500 = true; // Success
          // this.response500 = response.returnNumber === 200
          this.alertMessage = response.successMessage;
          this.imageURL = response.imageURL;
          this.name =response.name
          this.closeModalafter2sec();
          this.visitorDetails=null
          this.qrResult = {}
        } else {
          this.response500 = false; // Error
          this.alertMessage = response.errorMessage;
          this.closeModalafter2sec();
          this.visitorDetails=null
        }
        this.checkInLoadingSubject.next(false);
      },
      (error) => {
        this.checkInLoadingSubject.next(false);
        console.error('Check-in failed:', error);
        // this.presentToast('Check-in failed:', 'danger');
        this.alertMessage = 'Check-in failed'
        this.closeModalafter2sec();
        
      }
    );
  }


  closeModalafter2sec = () => {
    setTimeout(() => {
      this.startQrCodeScanner();
      this.alertMessage = '';
      this.imageURL = ''
      this.name = ''
      this.modalCtrl.dismiss();
    }, 5000)
  }

  canceldata(){
    this.visitorDetails=null
  }
  stopQrCodeScanner (){
    if (this.html5QrCode !== null) {
      this.html5QrCode.stop();
    }
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
}
