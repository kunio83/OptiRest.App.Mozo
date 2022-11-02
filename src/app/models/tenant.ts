import { BusinessConfig } from "./business-config";
import { User } from "./user";

export class Tenant{
  id: number = 0;
  businessName: string = '';
  address: string = '';
  countryId: number = 0;
  stateId: number = 0;
  cityId: number = 0;
  email: string = '';
  web: string = '';
  phone: string = '';

  businessConfig: BusinessConfig = new BusinessConfig;
}
