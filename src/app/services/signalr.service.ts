import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { AppData } from '../models/app-data';
import { DinerUser } from '../models/diner-user';
import { NotificationService } from './notificacion.service';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  appName: string = 'optirest-mozo';
  appGuid: string;
  hubConnection: signalR.HubConnection;
  private appsConnectedBehaviorSubject: BehaviorSubject<AppData[]> = new BehaviorSubject<AppData[]>([]);

  constructor(
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.urlNotificationsHub + 'mainHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        // if (localStorage.getItem('appGuid') != null) {
        //   this.appGuid = localStorage.getItem('appGuid') ?? '';
        // }
        // else {
        //   this.appGuid = uuidv4();
        //   localStorage.setItem('appGuid', this.appGuid);
        // }

        this.updateAppsConnected();
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  updateAppsConnected = () => {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '');

      this.hubConnection.invoke('SetConnectionId', this.appName).then(() => {
        this.hubConnection.invoke('GetAppIds').then((appIds: AppData[]) => {
          console.log('appIds:-->', appIds);
          this.appsConnectedBehaviorSubject.next(appIds);
        })
      });
  };

  sendNotificationByAppName = (message: string, appName: string) => {
  // let connectionIds: string[] = this.appsConnectedBehaviorSubject.getValue().map(a => a.notificationAppData).filter(a => a.appName == appName).map(e => e.connectionId);

    this.hubConnection.invoke('sendMessageByAppName', message, appName)
      .catch(err => console.error(err));
  }

  // sendNotificationByAppGuid = (message: string, appGuid: string) => {
  //   let connectionId: string = this.appsConnectedBehaviorSubject.getValue().find(q => q.appGuid == appGuid)?.notificationAppData.connectionId ?? '';

  //   this.hubConnection.invoke('sendMessage', message, [connectionId])
  //     .catch(err => console.error(err));
  // }

  startReceiveMessage = () => {
    this.hubConnection.on('receiveMessage', (message) => {
      this.toastr.show(message);

      let notification = new Notification(uuidv4(), 'Some title', message, new Date(), 'Some type', false);

      this.notificationService.saveNotificationToStorage(notification);
    });
  }
}
