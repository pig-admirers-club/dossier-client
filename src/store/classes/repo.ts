export class Repo {
  data: any; 
  constructor(data) {
    this.data = data;
  }

  setActive(bool) {
    this.data.active = bool;
  }

  reports() {
    return this.data.reports;
  }

  active() {
    return this.data.active;
  }

  name() {
    return this.data.name;
  }

  owner() {
    return this.data.owner;
  }

  id() {
    return this.data.id;
  }

  setName(name) {
    this.data.name = name;
  }
}