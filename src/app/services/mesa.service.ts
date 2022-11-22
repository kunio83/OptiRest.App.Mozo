import { HttpClient } from '@angular/common/http';
import { AbstractType, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MesaRequest } from '../models/mesa-request';
import { Table } from '../models/table';
import { TableService } from '../models/tableService';

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  public _currentResult: Observable<Table> = new Observable<Table>();

  constructor(private http: HttpClient) {}

  getMesaData(mesaRequest: MesaRequest): Observable<Table> {

    let result = this.http.get<Table>(environment.urlApiBase + 'table/' + mesaRequest.mesaId);
    this._currentResult = result

    return result;
  }

  openMesa(tableService: TableService): Observable<TableService> {
    let result = this.http.post<TableService>(environment.urlApiBase + 'tableservice', tableService);

    return result;
  }
  getMesas(tenantId : number) : Observable<Table[]>{
    return this.http.get<Table[]>(environment.urlApiBase + 'Table?tenantId=' + tenantId);
  }

  updateTableService(tableService: TableService): Observable<TableService> {
    return this.http.put<TableService>(environment.urlApiBase + 'tableservice/', tableService);
  }

  getTableService(tableServiceId: number): Observable<TableService> {
    let result = this.http.get<TableService>(environment.urlApiBase + 'tableservice/' + tableServiceId);

    return result;
  }

  deleteTableService2Item(tableServiceId: number, itemId: number): Observable<number> {
    return this.http.delete<number>(environment.urlApiBase + 'TableService2Item/byTableServiceIdAndItemId?tableServiceId=' + tableServiceId + '&itemId=' + itemId);
  }


}
