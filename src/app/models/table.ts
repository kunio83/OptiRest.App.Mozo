import { Tenant } from "./tenant";
import { User } from "./user";

export class Table{
  id: number;
  tenantId: number;
  areaId: number;
  name: string;
  length: number;
  width: number;
  shapeId: number;
  stateId: number;
  posX: number;
  posY: number;
  userId: number;

  user: User;
  tenant: Tenant;
}
