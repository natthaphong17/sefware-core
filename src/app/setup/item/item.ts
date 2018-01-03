export class Item {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  unit?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: Item) {
    Object.assign(this, params);
  }
}
