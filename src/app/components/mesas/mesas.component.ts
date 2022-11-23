import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TableService } from 'src/app/models/tableService';
import { User } from 'src/app/models/user';
import { MesaService } from 'src/app/services/mesa.service';
import { TableServiceService } from 'src/app/services/table-service.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {
  itemForms: FormArray = this.fb.array([]);
  userList: any[];
  serviceStateList: any[];
  tableServiceList: TableService[];
  tablelist: any[];
  itemList: any[];
  itemStateList: any[];
  selectedService: TableService;
  serviceForms: FormArray = this.fb.array([]);
  notification = null;
  orderTotal: number;
  currentUser: User;
  mesaServList: any = [];

  constructor(
    private fb: FormBuilder,
    private tableServiceService: TableServiceService,
    private mesaService: MesaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '');

    this.mesaService.getMesas(environment.tenantId).subscribe(
      res => {
        this.tablelist = res as [];
        this.tablelist = this.tablelist.filter(t => t.userId == this.currentUser.id);

        this.tableServiceService.getTableServiceStates().subscribe(
          res => {
            this.serviceStateList = res as [];
            this.tableServiceService.getTableServices(environment.tenantId).subscribe(
              res => {
                this.tableServiceList = res as [];
                this.tableServiceList = this.tableServiceList.filter(ts => ts.userId == this.currentUser.id);

                this.updateTableList();
              });

          });

      });
  }

  updateTableList() {
    this.mesaServList = [];
    let mesas = this.tablelist;
    let servicios = this.tableServiceList;
    mesas.forEach((mesa: any) => {
      let mesaId = mesa.id;
      let mesaName = this.getTableName(mesaId);
      let mesaState = mesa.stateId;
      let servId = 0;
      let servDiners = 0;
      let servState = 0;
      let servMesa = servicios.filter(s => s.tableId == mesaId)[0];
      if (servMesa) {
        servId = servMesa.id;
        servDiners = servMesa.diners;
        servState = servMesa.serviceStateId;
      }
      this.mesaServList.push({
        mesaId: mesaId,
        mesaName: mesaName,
        mesaState: mesaState,
        servId: servId,
        servDiners: servDiners,
        servState: servState,
        servMesa: servMesa
      })
    });

    this.mesaServList.sort((a: any, b: any) => (a.servState < b.servState) ? 1 : ((b.servState < a.servState) ? -1 : 0));
  }

  getTableName(tableId: number) {
    var tableName = this.tablelist.find(x => x.id == tableId)
    if (tableName != undefined) {
      return tableName.name;
    }
    console.log(this.tableServiceList);
  }
  getStateName(stateId: number) {
    var stateName = this.serviceStateList.find(x => x.id == stateId)
    if (stateName != undefined) {
      return stateName.name;
    }
    return "";
  }

  iraMesa(mesaName: string, servId: number){
    console.log(servId);
    localStorage.setItem('mesa', mesaName);
    this.tableServiceService.getTableService(servId).subscribe({
      next: data =>{
        localStorage.setItem('currentTableService', JSON.stringify(data));
        this.router.navigateByUrl('/cartilla');
      },
    });
  }

  abrirMesa(serv: any){
    let comensales = (document.getElementById("comensales") as HTMLInputElement).valueAsNumber;

    let tableService: TableService = new TableService();
    tableService.tableId = serv.mesaId;
    tableService.userId = this.currentUser.id;
    tableService.tenantId = environment.tenantId;
    tableService.serviceStateId = 1;
    tableService.dinerUserId = 0;
    tableService.diners = comensales;
    tableService.items = [];
    tableService.serviceStart = new Date();

    this.tableServiceService.postTableService(tableService).subscribe(res => {
      console.log(res);
    });

  }


  cambiaEstado(servMesa: TableService){
    servMesa.serviceStateId = 1;
    this.tableServiceService.putTableService(servMesa).subscribe((result)=>{
      console.log(result);
      this.updateTableList();
    });
  }







}


