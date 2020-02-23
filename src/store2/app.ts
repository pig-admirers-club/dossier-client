import PubSub from 'pubsub-js';
import "reflect-metadata";
import { Container, injectable, inject } from "inversify";

export enum ERRORS {
  API_ERROR,
  UNAUTHORIZED
}

const TYPE = {
  ApiService: Symbol.for("ApiService"),
  ErrorService: Symbol.for("ErrorService")
}

class Me {
  data: any;
  constructor(data) {
    this.data = data;
  }

  name() {
    return this.data.login
  }
}

class Repo {
  data: any; 
  constructor(data) {
    this.data = data;
  }

  setActive(bool) {
    this.data.active = bool;
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

@injectable()
export class AppStore {
  
  user: any;
  authorized: boolean = false;
  repos: Array<any> = [];
  busy: boolean = false;
  me: any = {}
  activeRepo: Repo = null;

  private errorService: ErrorService;
  private apiService: ApiService;

  constructor(
    @inject(TYPE.ApiService) apiService: ApiService, 
    @inject(TYPE.ErrorService) errorService: ErrorService
  ) {
    this.apiService = apiService;
    this.errorService = errorService;

    this.errorService.subscribe(ERRORS.API_ERROR, (_, message) => {
      console.log('error', message); 
    })

    this.errorService.subscribe(ERRORS.UNAUTHORIZED, (_, response) => {
      this.authorized = false;
      console.log('unauth', response);
    })
  }

  setActiveRepo(repo) {
    this.activeRepo = repo;
  }

  async activateRepo(repoId) {
    this.busy = true
    const repo = this.repos.find((repo) => repo.id() === repoId)
    repo.setActive(true);
    const ok = await this.apiService.activate(repoId);
    if (!ok) {
      repo.setActive(false);
    }
    this.busy = false
  }

  async deactivateRepo(repoId) {
    this.busy = true
    const repo = this.repos.find((repo) => repo.id() === repoId)
    repo.setActive(false);
    const ok = await this.apiService.activate(repoId, false);
    if (!ok) {
      repo.setActive(true);
    }
    this.busy = false
  } 

  async fetchMe() {
    this.busy = true;
    const user = await this.apiService.me();
    this.me = new Me(user);
    this.authorized = true;
    this.busy = false;
  }

  async fetchRepos() {
    this.busy = true;
    await this.getRepos();
    this.busy = false;
  }

  async getRepos() {
    const repos = await this.apiService.repos();
    this.repos = repos.map((repo) => new Repo(repo));
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

  async activate(repoId, activate=true) {
    try {
      const fragment = activate ? 'activate' : 'deactivate';
      const response = await fetch(`${this.reposUrl()}/${repoId}/${fragment}`, { method: 'POST'});
      if (response.ok) {
        return true
      } else {
        this.handleError(response);
        return false
      }
    } catch(e) {
      this.errorService.publish(ERRORS.API_ERROR, e);
      return false;
    }
  }

  async me() {
    try {
      const response = await fetch(this.meUrl());
      if (response.ok) {
        const user = await response.json();
        return JSON.parse(user)
      } else {
        this.handleError(response);
        return {}
      }
    } catch (e) {
      console.log(e);
      this.errorService.publish(ERRORS.API_ERROR, e);
      return {};
    }
  }

  async repos() {
    try {
      const response = await fetch(this.reposUrl());
      if (response.ok) { 
        const repos = await response.json();
        return JSON.parse(repos);
      } else {
        this.handleError(response);
        return []
      }
    } catch (e) {
      console.log('catch', e)
      this.errorService.publish(ERRORS.API_ERROR, e);
      return [];
    }
  }

  handleError(response) {
    switch(response.status) {
      case 500:
        this.errorService.publish(ERRORS.API_ERROR, response)
        break;
      case 401: 
        this.errorService.publish(ERRORS.UNAUTHORIZED, response);
        break;
    }
  }
}

var container = new Container();
container.bind<AppStore>(AppStore).toSelf();
container.bind<ApiService>(TYPE.ApiService).to(ApiService);
container.bind<ErrorService>(TYPE.ErrorService).to(ErrorService);
export const AppService = container.get(AppStore);