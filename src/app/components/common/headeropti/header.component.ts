import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-headeropti',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'OptiRest Comensal App';

  constructor(
    private router: Router,
    private loginService: LoginService,
    ) {}

    ngOnInit() {
    }

  logOut() {
    this.loginService.setUserLogged(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMesa');
    this.router.navigateByUrl('/');
  }
}
