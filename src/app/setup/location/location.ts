export class Location {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: Location) {
    Object.assign(this, params);
  }
}
