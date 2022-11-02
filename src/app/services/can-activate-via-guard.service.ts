import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { User } from '../models/user';

@Injectable()
export class CanActivateViaAuthGuardService implements CanActivate {

    constructor(
      private router: Router
      ) { }

    canActivate() {
      let currentUser: User = JSON.parse(localStorage.getItem('currentUser') ?? '{}');

      if (
        currentUser == undefined ||
        currentUser?.id == undefined ||
        currentUser?.id == null ||
        currentUser?.id == 0
        ) {
          this.router.navigate(['/']);
          return false;
      }

      return true;
    }
}
