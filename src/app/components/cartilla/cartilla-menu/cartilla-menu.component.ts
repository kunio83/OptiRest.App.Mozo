import { Component, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item';
import { ItemCategory } from 'src/app/models/item-category';
import { Table } from 'src/app/models/table';
import { CartillaService } from 'src/app/services/cartilla.service';

@Component({
  selector: 'app-cartilla-menu',
  templateUrl: './cartilla-menu.component.html',
  styleUrls: ['./cartilla-menu.component.css']
})
export class CartillaMenuComponent implements OnInit {
  itemsFiltered: Item[] = [];
  allItems: Item[] = [];
  itemCategories: ItemCategory[] = [];
  @Output() itemsToOrder: Item[] = [];

  constructor(
    private cartillaService: CartillaService
  ) { }

  ngOnInit(): void {
    //let mesaData: Table = JSON.parse(localStorage.getItem('currentMesa') ?? '');
    //this.cartillaService.getAllItems(mesaData.tenantId).subscribe(items => {
    this.cartillaService.getAllItems(2).subscribe(items => {
      const itemCategoryNames: string[] = [];
      this.itemsFiltered = items;
      this.allItems = items;

      this.itemCategories.push({name: 'Todos', id: 0, tenantId: 0});
      this.itemsFiltered
        .map(item => item.itemCategory)
        .forEach(itemCategory => {
          if (itemCategory != null && !itemCategoryNames.includes(itemCategory.name)) {
            itemCategoryNames.push(itemCategory.name);
            this.itemCategories.push(itemCategory);
          }
        });
    });
  }

  filterByCategory(event: any) {
    let categoryName: string = event.target.innerHTML;
    console.log(event.target.innerHTML);

    document.querySelectorAll('span.sc-bxivhb').forEach(function (elem)
    {
      elem.classList.remove('category-selected');
    });

    event.target.classList.add('category-selected');

    if (categoryName == 'Todos') {
      this.itemsFiltered = this.allItems;
    } else {
      this.itemsFiltered = this.allItems.filter(item => item.itemCategory?.name == categoryName);
    }
  }

}
