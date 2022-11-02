import { Kitchen } from "./kitchen";

export class User {
  id: number = 0;
  tenantId: number = 0;
  userName: string = '';
  passwordHash: string = '';
  email: string = '';
  firstNames: string = '';
  lastName: string = '';
  roleId: number = 0;
  active: boolean = false;

  kitchens: Kitchen[] = [];
}
