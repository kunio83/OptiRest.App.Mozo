import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private behaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isUserLogged(): Observable<boolean> {return this.behaviorSubject.asObservable();}

  constructor() { }

  setUserLogged(isLogged: boolean): void {
    this.behaviorSubject.next(isLogged);
  }

}
