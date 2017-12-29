export class ItemGroup {

  code?: string = 'N/A';
  // item_type?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: ItemGroup) {
    Object.assign(this, params);
  }
}
