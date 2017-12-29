export class uom {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: uom) {
    Object.assign(this, params);
  }
}
