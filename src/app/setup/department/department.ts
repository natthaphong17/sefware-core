export class Department {

  code?: string = 'N/A';
  name1?: string | null | undefined;
  name2?: string | null | undefined;

  constructor(params: Department) {
    Object.assign(this, params);
  }
}
