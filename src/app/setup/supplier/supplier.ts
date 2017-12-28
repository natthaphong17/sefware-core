export class Supplier {
  code?: string = 'N/A';
  dn1?: string | null | undefined;
  dn2?: string | null | undefined;
  address?: string | null | undefined;
  tel?: string | null | undefined;
  phone?: string | null | undefined;
  email?: string | null | undefined;
  fax?: string | null | undefined;
  term?: string | null | undefined;
  bank?: string | null | undefined;


  constructor(params: Supplier) {
    Object.assign(this, params);
  }
}
