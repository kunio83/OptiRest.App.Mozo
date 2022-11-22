import { CartillaService } from 'src/app/services/cartilla.service';
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
  rout = this.router.url;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private cartillaService: CartillaService
    ) {}

    ngOnInit() {
    }

  logOut() {
    this.loginService.setUserLogged(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentMesa');
    this.router.navigateByUrl('/');
  }



  reDir(dir: string) {
    this.cartillaService.setCurrentTab = dir;
    this.router.navigateByUrl('/' + dir);
  }

}


