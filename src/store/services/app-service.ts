import { ErrorService } from './error-service';
import { ApiService } from './api-service';
import { injectable, inject } from 'inversify';
import { TYPE, ERRORS } from './../types/types';
import { Repo } from '../classes/repo';
import { Me } from '../classes/me';

export class RepoPager {
  currentPage = 1;
  count: number;
  REPOS_PER_PAGE: number = 12;

  constructor(count) {
    this.count = count
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  getPage(): number {
    return this.currentPage;
  }

  pages() {
    return Math.ceil(this.count / this.REPOS_PER_PAGE)
  }

  offset() {
    return (this.getPage() - 1) * this.REPOS_PER_PAGE;
  }
}

@injectable()
export class AppService {
  user: any;
  authorized: boolean = false;
  repos: Array<any> = [];
  busy: boolean = false;
  me: any = {}
  repoPager: RepoPager;
  currentPage: 1;
  activeRepo: Repo = null;
  newReport = {
    repo_id: null,
    name: 'New Report',
    framework: 'RubyCucumber'
  };

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

  resetReport(){ 
    this.newReport = {
      repo_id: null,
      name: 'New Report',
      framework: 'RubyCucumber'
    };
  }
  setActiveRepo(repo) {
    this.activeRepo = repo;
  }

  async saveReport() {
    const payload = this.newReport;
    payload.repo_id = this.activeRepo.id();
    this.busy = true;
    const id = await this.apiService.newReport(payload);
    this.busy = false;
    console.log('id of new report', id);
  }

  async fetchMe() {
    this.busy = true;
    const user = await this.apiService.me();
    this.me = new Me(user);
    this.authorized = true;
    this.busy = false;
  }

  async fetchRepos(firstTime=true) {
    this.busy = true;
    if (firstTime) {
      const count = await this.apiService.countRepos();
      this.repoPager = new RepoPager(count);
    }
    await this.getRepos({ offset: this.repoPager.offset(), per_page: this.repoPager.REPOS_PER_PAGE });
    this.busy = false;
  }

  async getRepos(pagination) {
    const repos = await this.apiService.repos(pagination);
    repos.forEach((repo) => repo.reports = JSON.parse(repo.reports))
    this.repos = repos.map((repo) => new Repo(repo))
    if (this.activeRepo) {
      this.activeRepo = this.repos.find(repo => repo.id() === this.activeRepo.id())
    }
  }
}