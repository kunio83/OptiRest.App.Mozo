import { CartillaService } from 'src/app/services/cartilla.service';
import { TableService } from 'src/app/models/tableService';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { MesaService } from 'src/app/services/mesa.service';
import { option } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-cuenta-modal',
  templateUrl: './cuenta-modal.component.html',
  styleUrls: ['./cuenta-modal.component.css']
})
export class CuentaModalComponent implements OnInit {
  @Input() name: string;
  @Input() totalPriceOrder: number;
  @Input() itemsOredered: any[];
  showMPModal: boolean = false;
  showSpinner: boolean = false;
  endPayment: boolean = false;


	constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private signalrService: SignalrService,
    private router: Router,
    private loginService: LoginService,
    private cartillaService: CartillaService,
    private mesaService: MesaService
    ) {}

    ngOnInit(): void {

  }

  enviarPedido: () => void = () => {
    this.toastr.success('Cuenta efectuada!');
    this.activeModal.close();
  }

  payMercadoPago(): void {
    this.showSpinner = true;
    this.showMPModal = true;


    // hacer update a tableservice
    let currentTableService: TableService = JSON.parse(localStorage.getItem('currentTableService') ?? '');
    currentTableService.paymentMethod = 'mercadopago';
    currentTableService.paymentReference = '-';
    currentTableService.comment= '-';
    currentTableService.serviceStateId = 4;

    this.cartillaService.updateTableService(currentTableService).subscribe(response => {

      setTimeout(() => {
        this.showSpinner = false;
        this.endPayment = true;
        this.signalrService.sendNotificationByAppName('La mesa 3 pagó a traves de MercadoPago', 'optirest-admin');
        this.signalrService.sendNotificationByAppName('La mesa 3 pagó a traves de MercadoPago', 'optirest-mozo');

      }, 2000);

      localStorage.removeItem('currentTableService');
    });
  }

  payCash(): void {
    this.signalrService.sendNotificationByAppName('La mesa 3 requiere pagar en Efectivo', 'optirest-admin');
    this.signalrService.sendNotificationByAppName('La mesa 3 requiere pagar en Efectivo', 'optirest-mozo');
    this.toastr.success('Cuenta efectuada!, se dará aviso al mozo.');

    // aca tengo que cambiar el estado de TableService en "pedido de pago"
    let currentTableService: TableService = JSON.parse(localStorage.getItem('currentTableService') ?? '');
    this.mesaService.getTableService(currentTableService.id).subscribe((data)=>{
      data.serviceStateId = 3;

      this.mesaService.updateTableService(data).subscribe((data)=>{
        localStorage.setItem('currentTableService', JSON.stringify(data));
        console.log(data);
      });
    });

    this.activeModal.close();
  }

  closeMPModal(): void {
    this.showMPModal = false;
    this.activeModal.close();

    this.toastr.success('Gracias por utilizar OptiRest','Gracias', {timeOut: 4000} )

    //localStorage.removeItem('currentUser');

    this.router.navigateByUrl('/qrreading');
  }
}
