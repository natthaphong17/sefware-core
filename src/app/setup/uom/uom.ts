export class Uom {

  code?: string = 'N/A';
  shortname?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: Uom) {
    Object.assign(this, params);
  }
}