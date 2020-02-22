import PubSub from 'pubsub-js';
import "reflect-metadata";
import { Container, injectable, inject } from "inversify";

export enum ERRORS {
  API_ERROR
}

const TYPE = {
  ApiService: Symbol.for("ApiService"),
  ErrorService: Symbol.for("ErrorService")
}

class Repo {
  data: any; 
  constructor(data) {
    this.data = data;
  }

  name() {
    return this.data.name;
  }

  owner() {
    return this.data.owner.login;
  }

  id() {
    return this.data.id;
  }

  setName(name) {
    this.data.name = name;
  }
}

@injectable()
export class AppStore {
  
  user: any;
  authenticated: boolean = false;
  repos: Array<any> = [];
  busy: boolean = false;
  
  private errorService: ErrorService;
  private apiService: ApiService;

  constructor(
    @inject(TYPE.ApiService) apiService: ApiService, 
    @inject(TYPE.ErrorService) errorService: ErrorService
  ) {
    this.apiService = apiService;
    this.errorService = errorService;

    this.errorService.subscribe(ERRORS.API_ERROR, (message) => {
      this.authenticated = false;
      console.log(message); 
    })
  }

  removeRepo(name) {
    this.repos = this.repos.filter((repo) => repo.name() !== name)
  }

  async fetchRepos() {
    this.busy = true;
    await this.getRepos();
    this.busy = false;
  }

  async getRepos() {
    const repos = await this.apiService.repos();
    this.repos = repos.map((repo) => new Repo(repo));
    this.authenticated = true;
  }
}


@injectable()
class ErrorService {
  publisher;
  constructor() {
    this.publisher = PubSub;
  }

  subscribe(errorType, callback) {
    return this.publisher.subscribe(errorType, callback);
  }

  publish(errorType, payload) {
    return this.publisher.publish(errorType, payload);
  }
}

@injectable()
class ApiService {

  errorService: ErrorService;

  constructor(
    @inject(TYPE.ErrorService) errorService: ErrorService
  ) {
    this.errorService = errorService;
  }

  private meUrl() {
    return '/api/me';
  }

  private reposUrl() {
    return `${this.meUrl()}/repos`;
  }

  async repos() {
    try {
      const response = await fetch(this.reposUrl());
      const repos = await response.json();
      return JSON.parse(repos);
    } catch (e) {
      this.errorService.publish(ERRORS.API_ERROR, e);
      return [];
    }
  }
}

var container = new Container();
container.bind<AppStore>(AppStore).toSelf();
container.bind<ApiService>(TYPE.ApiService).to(ApiService);
container.bind<ErrorService>(TYPE.ErrorService).to(ErrorService);
export const AppService = container.get(AppStore);