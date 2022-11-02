import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notificacion.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  notifications: Notification[];

  constructor(
    private notificationService: NotificationService,
    private signalrService: SignalrService
  ) { }


  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {

    // ordenando notificaciones por fecha de creación de forma descendente
    const sortedDesc = notifications.sort(
      (objA: Notification, objB: Notification) => new Date(objB.date).getTime() - new Date(objA.date).getTime()
      );

    this.notifications = sortedDesc as Notification[];
    });
  }
  deleteNotification(notification: Notification) {
    this.notificationService.deleteNotificationFromStorage(notification);
  }
  setNotificationReaded(notification: Notification) {
    notification.readed = true;
    this.notificationService.updateNotification(notification);
  }

}
