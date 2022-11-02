import { HttpClient } from '@angular/common/http';
import { AbstractType, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MesaRequest } from '../models/mesa-request';
import { Table } from '../models/table';
import { TableService } from '../models/table-service';

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
}
