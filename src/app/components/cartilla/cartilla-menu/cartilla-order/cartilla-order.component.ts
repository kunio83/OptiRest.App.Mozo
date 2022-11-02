import { Component, OnInit, Input, Output } from '@angular/core';
import { CartillaService } from 'src/app/services/cartilla.service';

@Component({
  selector: 'app-cartilla-order',
  templateUrl: './cartilla-order.component.html',
  styleUrls: ['./cartilla-order.component.css']
})
export class CartillaOrderComponent implements OnInit {
  itemsQuantity: number = 0;
  showCartillaOrder: boolean = false;
  @Input() openLista: Function;

  constructor(
    private cartillaService: CartillaService
  ) { }

  ngOnInit(): void {
    this.cartillaService.itemsToOrder.subscribe(items => {
      this.itemsQuantity = items.map(i => i.quantity).reduce((acumulator, value)=>acumulator + value, 0);
      this.showCartillaOrder = this.itemsQuantity > 0;
    }
  )};

  goToOrder(): void {
    this.cartillaService.setCurrentTab = 'lista';
  }
}
