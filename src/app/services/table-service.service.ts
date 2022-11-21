import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TableService } from '../models/tableService';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

  constructor(private httpClient : HttpClient) { }

  getTableServicesLista(tenantId: number){
  return this.httpClient.get(environment.urlApiBase + 'TableService/byTenant/' + tenantId );
}

  getTableServices(tenantId: number): Observable<TableService[]>{
    return this.httpClient.get<TableService[]>(environment.urlApiBase + 'TableService/byTenant/' + tenantId );
}

  getTableServiceStates() {
  return this.httpClient.get(environment.urlApiBase + 'ServiceState');
}
  
  postTableService(formData: TableService){ 
    return this.httpClient.post(environment.urlApiBase + 'TableService', formData);
}

  putTableService(formData: TableService){
    return this.httpClient.put(environment.urlApiBase + 'TableService', formData);

}

  deleteTableService(id: number){
    return this.httpClient.delete(environment.urlApiBase + 'TableService/' + id);
    
}
}