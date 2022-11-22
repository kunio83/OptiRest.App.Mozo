import { MesaService } from 'src/app/services/mesa.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { CuentaModalComponent } from './cuenta-modal/cuenta-modal.component';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ItemToOrder } from 'src/app/models/item-to-order';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { TableService } from 'src/app/models/tableService';
import { TableService2Item } from 'src/app/models/table-service2-items';
import { CartillaService } from 'src/app/services/cartilla.service';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-cartilla-carrito',
  templateUrl: './cartilla-carrito.component.html',
  styleUrls: ['./cartilla-carrito.component.css']
})
export class CartillaCarritoComponent implements OnInit {
  itemsToOrder: ItemToOrder[] = [];
  totalPrice: number;
  itemsOredered: TableService2Item[];
  totalPriceOrder: number;

  constructor(
    private cartillaService: CartillaService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private signalrService: SignalrService,
    private mesaService: MesaService
    ) { }

  ngOnInit(): void {
    this.cartillaService.itemsToOrder.subscribe(items => {
      this.itemsToOrder = items;
      this.totalPrice = this.itemsToOrder.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
    });

    this.updateOrderedItems();
  }

  updateOrderedItems(){
    if (localStorage.getItem('currentTableService')) {
      let currentTableService: TableService = JSON.parse(localStorage.getItem('currentTableService') ?? '');

      this.cartillaService.refreshOrderedItems(currentTableService.id);
      this.cartillaService.getOrderedItems(currentTableService.id).subscribe(response => {
        this.itemsOredered = response;
      });
    }
  }

  removeItemFromOrder(item: ItemToOrder): void {
    this.cartillaService.removeItemFromOrder(item);
  }

  removeItemOrdered(item: ItemToOrder): void{
    let currentTableService: TableService = JSON.parse(localStorage.getItem('currentTableService') ?? '');

    this.mesaService.getTableService(currentTableService.id).subscribe((data)=>{
        let itemToDelete: Item = data.items.find(i => i.id == item.item.id) ?? new Item;
        let index = data.items.indexOf(itemToDelete);
        data.items.splice(index,1);

        this.mesaService.deleteTableService2Item(currentTableService.id, itemToDelete.id).subscribe((result)=>{
          console.log(result);
          localStorage.setItem('currentTableService', JSON.stringify(data));
          this.itemsOredered.splice(index, 1);
        });
    });

  }

  updateTotalPrice(): void {
    this.totalPriceOrder = this.itemsOredered.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  }

  order(): void {
    let currentTableService: TableService = JSON.parse(localStorage.getItem('currentTableService') ?? '');
    let order: Order = new Order();
    let orderDetails: OrderDetail[] = [];

    this.itemsToOrder.forEach(item => {
      let orderDetail: OrderDetail = new OrderDetail();
      orderDetail.itemId = item.item.id;
      orderDetail.quantity = item.quantity;
      orderDetails.push(orderDetail);
    });

    order.tableServiceId = currentTableService.id;
    order.orderDetails = orderDetails;

    this.cartillaService.makeOrder(order).subscribe(response => {
      if (response) {
        this.cartillaService.clearOrder();
        this.toastr.success('Pedido realizado con éxito');
        this.cartillaService.refreshOrderedItems(currentTableService.id);
        this.updateOrderedItems();
        this.signalrService.sendNotificationByAppName('refreshorder','optirest-admin');
      }
    }, error => {
      this.toastr.error(error.error, 'Error al realizar el pedido');
    }
    );
  }

  cuenta(): void{
    this.updateTotalPrice();
    const modalRef = this.modalService.open(CuentaModalComponent);
		modalRef.componentInstance.name = 'Cuenta';
    modalRef.componentInstance.totalPriceOrder = this.totalPriceOrder;
    modalRef.componentInstance.itemsOredered = this.itemsOredered;
  }
}
