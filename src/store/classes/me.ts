export class Me {
  data: any;
  constructor(data) {
    this.data = data;
  }

  name() {
    return this.data.login
  }
}
