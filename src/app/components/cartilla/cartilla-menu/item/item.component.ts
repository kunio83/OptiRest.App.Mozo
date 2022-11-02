import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/item';
import { CartillaService } from 'src/app/services/cartilla.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item: Item;
  //@Input() addItemToOrder: Function;
  //@Input() itemsToOrder: Item[] = [];

  inputItemQuantity: number = 1;
  hasThisItem: boolean = false;
  totalItemQuantity: number = 0;
  constructor(
    private cartillaService: CartillaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  decreaseItemQuantity(): void {
    if (this.inputItemQuantity > 1) {
      this.inputItemQuantity--;
    }
  }

  increaseItemQuantity(): void {
    this.inputItemQuantity++;
  }

  addItemToCart(): void {
    this.totalItemQuantity += this.inputItemQuantity;
    this.hasThisItem = true;

    this.cartillaService.addItemsToOrder(this.item, this.inputItemQuantity);
    this.toastr.info(this.inputItemQuantity.toString() + ' unidades de ' + this.item.title + ' agregados al pedido.');
  }
}
