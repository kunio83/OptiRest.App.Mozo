import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableService2Item } from '../models/tablesService2Item';

@Injectable({
  providedIn: 'root'
})
export class TableService2ItemService {

  private item2ServicebehaviorSubject: BehaviorSubject<TableService2Item[]> = new BehaviorSubject<TableService2Item[]>([]);

  constructor(private httpClient : HttpClient) { }

  getTableService2Items(tableServiceId : number) : Observable<TableService2Item[]>{
    return  this.httpClient.get<TableService2Item[]>(environment.urlApiBase + 'TableService2Item/byTableService?tableServiceId=' + tableServiceId)
  }

  addTableService2Item(tableService2Item : TableService2Item){
    return this.httpClient.post(environment.urlApiBase + 'TableService2Item', tableService2Item);
  }

  updateTableService2Item(tableService2Item : TableService2Item){
    return this.httpClient.put(environment.urlApiBase + 'TableService2Item', tableService2Item);
  }

  deleteTableService2Item(id : number){
    return this.httpClient.delete(environment.urlApiBase + 'TableService2Item/' + id);
  }

  getInProgressItems(tenantId : number) : Observable<TableService2Item[]>{
    return this.item2ServicebehaviorSubject.asObservable();
  }

  refrestInProgressItems(tenantId : number) : void {
    this.httpClient.get<TableService2Item[]>(environment.urlApiBase + 'TableService2Item/inProgressItems?tenantId=' + tenantId).subscribe((data)=>{
      this.item2ServicebehaviorSubject.next(data);
    });
  }
}
