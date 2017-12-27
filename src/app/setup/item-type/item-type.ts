export class ItemType {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: ItemType) {
    Object.assign(this, params);
  }
}
