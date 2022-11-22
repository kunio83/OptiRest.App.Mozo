import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TableService } from 'src/app/models/tableService';
import { User } from 'src/app/models/user';
import { MesaService } from 'src/app/services/mesa.service';
import { TableServiceService } from 'src/app/services/table-service.service';
import { environment } from 'src/environments/environment';

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
    //private userService: UserService,
    //private serviceStateService: TableServiceStateService,
    private tableServiceService: TableServiceService,
    private mesaService: MesaService,
    //private tableService2ItemsService: TableService2ItemService,
    //private menuService: MenuService,
    //private itemStateService: ItemStateService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '');

    this.mesaService.getMesas(environment.tenantId).subscribe(
      res => { 
        this.tablelist = res as []; 
        this.tablelist = this.tablelist.filter(t => t.userId == this.currentUser.id);
      });
    
    this.tableServiceService.getTableServiceStates().subscribe(
      res => {this.serviceStateList = res as []; });

    this.tableServiceService.getTableServices(environment.tenantId).subscribe(
        res => {
          res.sort((a, b) => (a.serviceStateId < b.serviceStateId) ? 1 : ((b.serviceStateId < a.serviceStateId) ? -1 : 0));
          this.tableServiceList = res as [];
          this.tableServiceList = this.tableServiceList.filter(ts => ts.userId == this.currentUser.id);
        });  
      
  }

  updateTableList(){
    this.mesaServList = [];
    let mesas = this.tablelist;
    let servicios = this.tableServiceList;
    mesas.forEach((mesa: any)=>{
      let mesaId = mesa.id;
      let mesaName = this.getTableName(mesaId);
      let mesaState = mesa.stateId;
      let servId = 0;
      let servDiners = 0;
      let servState = 0;
      let servMesa = servicios.filter(s => s.tableId == mesaId)[0];
      if (servMesa)
      {
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
        servState: servState
      })
    });

    console.log(this.mesaServList);

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
}


