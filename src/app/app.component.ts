import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'OptiRest Comensal App';

  constructor(
    private signalrService: SignalrService
  ) {}

  ngOnInit() {
     this.signalrService.startConnection();

     setTimeout(() => {
      this.signalrService.startReceiveMessage();
    }, 2000);
  }

  ngOnDestroy() {
    this.signalrService.hubConnection.off('receiveMessage');
    this.signalrService.hubConnection.stop();
  }
}
