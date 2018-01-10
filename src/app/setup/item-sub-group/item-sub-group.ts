export class ItemSubGroup {
  code?: string = 'N/A';
  group_code?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;
  disable?: boolean = false;

  constructor(params: ItemSubGroup) {
    Object.assign(this, params);
  }
}
