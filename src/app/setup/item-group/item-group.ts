export class ItemGroup {

  code?: string = 'N/A';
  type_code?: string | null | undefined;
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: ItemGroup) {
    Object.assign(this, params);
  }
}
