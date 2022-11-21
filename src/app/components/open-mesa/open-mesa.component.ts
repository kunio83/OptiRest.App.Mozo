import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MesaRequest } from 'src/app/models/mesa-request';
import { Table } from 'src/app/models/table';
import { TableService } from 'src/app/models/tableService';
import { User } from 'src/app/models/user';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-open-mesa',
  templateUrl: './open-mesa.component.html',
  styleUrls: ['./open-mesa.component.css']
})
export class OpenMesaComponent implements OnInit {

  constructor(
    private mesaService: MesaService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  image = "";
  nombreResto = "";
  textoBienvenida = "";
  numeroMesa = 0;
  nombreMozo = "";
  mesaData: Table;
  inputComensales= 2;

  ngOnInit(): void {
    let messageTable:string = '';
    this.mesaData = JSON.parse(localStorage.getItem('currentMesa') ?? '');

    if(this.mesaData == undefined || this.mesaData == null){
      this.router.navigateByUrl('/');
    }

    this.image = this.mesaData.tenant.businessConfig.logo;
    this.nombreResto = this.mesaData.tenant.businessConfig.displayName;
    this.textoBienvenida = this.mesaData.tenant.businessConfig.slogan
    this.numeroMesa = this.mesaData.id;
    this.nombreMozo = this.mesaData.user.firstNames;

    messageTable = (this.mesaData.stateId == 2) ? 'La mesa se encuentra Cerrada' : (this.mesaData.stateId == 3) ? 'La mesa se encuentra Ocupada' : '';

    if(messageTable != ''){
      //this.isBeginButtonDisabled = true;
      this.toastr.warning(messageTable);
    }
  }

  onSubmit(): void{
    let currentUser: User = JSON.parse(localStorage.getItem('currentUser') ?? '');
    let tableService: TableService = new TableService();
    tableService.tableId = this.mesaData.id;
    tableService.userId = this.mesaData.userId;
    tableService.tenantId = this.mesaData.tenantId;
    tableService.serviceStateId = 1; //hardcodeado, ver como se obtiene el servicio actual
    tableService.dinerUserId = currentUser.id;
    tableService.diners = this.inputComensales;
    tableService.items = [];
    tableService.serviceStart = new Date();


    this.mesaService.openMesa(tableService).subscribe({
      next: data => {
        localStorage.setItem('currentTableService', JSON.stringify(data));
        this.router.navigateByUrl('/cartilla');
      },
    });


  }
}
