export class ItemSubGroup {

  code?: string = 'N/A';
  // item_group?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: ItemSubGroup) {
    Object.assign(this, params);
  }
}
