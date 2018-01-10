export class ItemType {
  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: ItemType) {
    Object.assign(this, params);
  }
}
