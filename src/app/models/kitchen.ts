import { User } from "./user";

export class Kitchen{
  id: number = 0;
  tenantId: number = 0;
  name: string = '';
  summary: string = '';

  users: User[] = [];
}
