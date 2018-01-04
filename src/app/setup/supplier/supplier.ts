export class Supplier {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  address?: string | null | undefined;
  phone?: string | null | undefined;
  fax?: string | null | undefined;
  email?: string | null | undefined;
  term?: string | null | undefined;
  bank?: string | null | undefined;

  constructor(params: Supplier) {
    Object.assign(this, params);
  }
}
