import { ItemCategory } from "./item-category";
import { Kitchen } from "./kitchen";

export class Item {
    id: number;
    tenantId: number;
    code: string;
    itemCategoryId: number;
    kitchenId: number;
    title: string;
    summary: string;
    price: number;
    active: boolean;
    itemCategory: ItemCategory | null;
    kitchen: Kitchen | null;
}
