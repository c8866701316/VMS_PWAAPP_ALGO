import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild('modal') modal: any;
  private authLocalStorageToken = `${environment.appVersion}-${environment.userDataKey}`;
  userInfo:any;

  handleRefresh(event:any) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }
  constructor(private modalController: ModalController,  private auth: AuthService) { }

  ngOnInit() {
    this.userInfo=localStorage.getItem(this.authLocalStorageToken);
    this.userInfo = JSON.parse(this.userInfo)
    localStorage.removeItem('newVisitor');
  }
  handleImageError(event:any){
    event.target.src='https://ionicframework.com/docs/img/demos/avatar.svg';
    event.target.style.width="20%",
    event.target.style.borderRadius="50px"
  }
  logout() {
    this.auth.logout();
    document.location.reload();
  }
  
  async dismiss() {
    await this.modalController.dismiss();
  }
}
