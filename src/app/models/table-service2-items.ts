import { Item } from "./item";
import { TableService } from "./tableService";

export class TableService2Item{
    id: number;
    tableServiceId: number;
    itemId: number;
    quantity: number;
    price: number;
    orderTime: Date;
    deliveryTime: Date;
    itemStateId: number;
    tableService: TableService;
    item: Item;
}