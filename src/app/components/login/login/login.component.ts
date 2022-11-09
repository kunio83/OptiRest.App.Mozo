import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { UsersService } from "../../../services/users.service";
import { Router } from '@angular/router';
import { User } from "src/app/models/user";
import { FrontPageComponent } from "../../common/front-page/front-page.component";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "src/app/services/login.service";
import { SignalrService } from "src/app/services/signalr.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["../shared/login.component.css"]
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  showSpinner: boolean = false;
  constructor(
    public userService: UsersService,
    public router: Router,
    private toastr: ToastrService,
    private loginService: LoginService,
    private signalr: SignalrService
    ) {}

  login() {
    const userInput = { email: this.email, password: this.password };
    this.showSpinner = true;

    this.userService
      .getUserByEmail(userInput.email)
      .subscribe({
        next: user => {

          if (user == undefined) {
            this.showErrror();
            this.showSpinner = false;
            return;
          }

          if (user.passwordHash == userInput.password)
          {
            this.loginService.setUserLogged(true);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigateByUrl('/mesas');
          }
          else
          {
            this.toastr.error('Contraseña incorrecta');
          }

          this.showSpinner = false;
        },
        error: err => {
          this.showErrror();
          this.router.navigateByUrl('/');
          this.showSpinner = false;
        },complete: ()=>{
          this.showSpinner = false;
        }
      });
  }

  showErrror(): void {
    this.toastr.error('Datos ingresados incorrectos!');
  }
}
