import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartillaComponent } from './components/cartilla/cartilla.component';
import { LoginComponent } from './components/login/login/login.component';
import { OpenMesaComponent } from './components/open-mesa/open-mesa.component';
import { CanActivateViaAuthGuardService } from './services/can-activate-via-guard.service';

const routes: Routes = [
  { path: "", component: LoginComponent, pathMatch: "full" },
  { path: "openmesa", component: OpenMesaComponent, pathMatch: "full",  canActivate: [CanActivateViaAuthGuardService] },
  { path: "cartilla", component: CartillaComponent, pathMatch: "full",  canActivate: [CanActivateViaAuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
