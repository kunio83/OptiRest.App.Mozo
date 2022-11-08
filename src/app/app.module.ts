import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './components/login/login/login.component';
import { FrontPageComponent } from './components/common/front-page/front-page.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './materia.module';
import { BrowserAnimationsModule}  from '@angular/platform-browser/animations';
import { MesaService } from './services/mesa.service';
import { OpenMesaComponent } from './components/open-mesa/open-mesa.component';
import { CartillaComponent } from './components/cartilla/cartilla.component';
import { CartillaCarritoComponent } from './components/cartilla/cartilla-carrito/cartilla-carrito.component';
import { CartillaMenuComponent } from './components/cartilla/cartilla-menu/cartilla-menu.component';
import { ItemComponent } from './components/cartilla/cartilla-menu/item/item.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { CartillaService } from './services/cartilla.service';
import { HeaderComponent } from './components/common/headeropti/header.component';
import { CanActivateViaAuthGuardService } from './services/can-activate-via-guard.service';
import { CartillaOrderComponent } from './components/cartilla/cartilla-menu/cartilla-order/cartilla-order.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { MesasComponent } from './components/mesas/mesas.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FrontPageComponent,
    OpenMesaComponent,
    CartillaComponent,
    CartillaCarritoComponent,
    CartillaMenuComponent,
    ItemComponent,
    HeaderComponent,
    CartillaOrderComponent,
    NotificacionesComponent,
    MesasComponent,
    PedidosComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ZXingScannerModule,
    MaterialModule,
    ToastrModule.forRoot(),
    NgxBootstrapIconsModule.pick(allIcons)
  ],
  providers: [CookieService, MesaService, CartillaService, CanActivateViaAuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
