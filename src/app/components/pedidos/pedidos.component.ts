import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TableService2Item } from 'src/app/models/table-service2-items';
import { ItemStateService } from 'src/app/services/item-state.service';
import { MesaService } from 'src/app/services/mesa.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { TableService2ItemService } from 'src/app/services/table-service2-item.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})

export class PedidosComponent implements OnInit {
  //pedidoForms: FormArray = this.fb.array([]);
  pedidoList : TableService2Item [];
  notification:any = null;
  cocinaList: any[];
  itemStateList: any[];
  tableList: any[];

  constructor(
    private fb: FormBuilder,
    private tableService2ItemService: TableService2ItemService,
    private itemStateService: ItemStateService,
    private tableService: MesaService,
    private signalRService: SignalrService
  ) { }


  ngOnInit(): void {
    this.tableService2ItemService.refrestInProgressItems(environment.tenantId);
    var mozo= JSON.parse(localStorage.getItem('currentUser')??'{}');
    this.tableService2ItemService.getInProgressItems(environment.tenantId).subscribe(
      res => { 
        this.pedidoList = res as TableService2Item[];
        this.pedidoList=this.pedidoList.filter(x => x.itemStateId == 3);
        this.pedidoList=this.pedidoList.filter(x => x.tableService.userId == mozo.id);
      });

    this.tableService.getMesas(environment.tenantId).subscribe(
      res => { this.tableList = res as []; });
    
    this.itemStateService.getItemStates().subscribe(
      res => { this.itemStateList = res as []; });

  }

  getTableName(tableId: number) {
    var table = this.tableList.find(x => x.id == tableId);
    return table ? table.name : '';
  }

  updateItemState(pedido: TableService2Item, itemStateId: number, i: number) {
    pedido.itemStateId = itemStateId;
    this.tableService2ItemService.updateTableService2Item(pedido).subscribe(
      res => {
        this.pedidoList.splice(i, 1);        
        this.signalRService.sendNotificationByAppName('refreshorder', 'optirest-comensal');

        this.notification = { class: 'text-success', message: 'Pedido actualizado' };
        setTimeout(() => this.notification = null, 4000);
            }
    );
  }

}
