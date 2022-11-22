import { TableService } from 'src/app/models/tableService';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { ItemToOrder } from '../models/item-to-order';
import { Order } from '../models/order';
import { TableService2Item } from '../models/table-service2-items';

@Injectable({
  providedIn: 'root'
})
export class CartillaService {
  constructor(private httpClient: HttpClient) { }

  // Items
  private behaviorSubject: BehaviorSubject<ItemToOrder[]> = new BehaviorSubject<ItemToOrder[]>([]);
  private itemsOrderedBehaviorSubject: BehaviorSubject<TableService2Item[]> = new BehaviorSubject<TableService2Item[]>([]);

  get itemsToOrder(): Observable<ItemToOrder[]> {return this.behaviorSubject.asObservable();}
  get itemsOrdered(): Observable<TableService2Item[]>{return this.itemsOrderedBehaviorSubject.asObservable();}

  getAllItems(tenantId: number): Observable<Item[]> {
    return this.httpClient.get<Item[]>(environment.urlApiBase + 'item?tenantId=' + tenantId);
  }

  addItemsToOrder(item: Item, quantity: number): void {
    const currentItemsToOrder = this.behaviorSubject.value;
    const currentItemIds = currentItemsToOrder.map(i => i.item.id);

    if (currentItemIds.includes(item.id)) {
      const itemToOrder = currentItemsToOrder.find(i => i.item.id === item.id) ?? new ItemToOrder();
      itemToOrder.quantity += quantity;
      this.behaviorSubject.next(currentItemsToOrder);
    } else {
      const newItemToOrder: ItemToOrder = new ItemToOrder();
      newItemToOrder.item = item;
      newItemToOrder.quantity = quantity;
      const updatedValue: ItemToOrder[] = [...currentItemsToOrder, newItemToOrder];

      this.behaviorSubject.next(updatedValue);
    }
  }

  getItemsToOrderValue(): ItemToOrder[] {
    return this.behaviorSubject.getValue();
  }

  removeItemFromOrder(item: ItemToOrder): void {
    const currentItemsToOrder = this.behaviorSubject.value;
    const updatedValue = currentItemsToOrder.filter(i => i.item.id !== item.item.id);

    this.behaviorSubject.next(updatedValue);
  }

  // Orders
  makeOrder(order: Order): Observable<Order> {
    console.log('ordenar');
    return this.httpClient.post<Order>(environment.urlApiBase + 'order', order);
  }

  clearOrder() {
    this.behaviorSubject.next([]);
  }

  getOrderedItems(tableServciceid: number): Observable<TableService2Item[]> {
    if (this.itemsOrderedBehaviorSubject.getValue() == undefined || this.itemsOrderedBehaviorSubject.getValue().length == 0) {
      this.refreshOrderedItems(tableServciceid);
    }

    return this.itemsOrderedBehaviorSubject.asObservable();
  }

  refreshOrderedItems(tableServciceid: number): void {
    this.httpClient.get<TableService2Item[]>(environment.urlApiBase + 'TableService2Item/byTableService?tableServiceId=' + tableServciceid).subscribe((itemsOrdered) => {

      if(localStorage.getItem('currentTableService') != null && localStorage.getItem('currentTableService') != '' ){
        this.itemsOrderedBehaviorSubject.next(itemsOrdered);
      }
    });
  }

  // Tabs
  private currentTabBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  get getCurrentTab(): Observable<string> { return this.currentTabBehaviorSubject.asObservable();}
  set setCurrentTab(value: string) {this.currentTabBehaviorSubject.next(value);}

  // payments
  updateTableService(tableService: TableService): Observable<TableService> {
    return this.httpClient.put<any>(environment.urlApiBase + 'TableService/', tableService);
  }

}
