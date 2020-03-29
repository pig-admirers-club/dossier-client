import { ErrorService } from './error-service';
import { injectable, inject } from 'inversify';
import { TYPE, ERRORS } from './../types/types';

@injectable()
export class ApiService {

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

  async me() {
    try {
      const response = await fetch(`${this.meUrl()}/info`);
      if (response.ok) {
        const user = await response.json();
        return JSON.parse(user)
      } else {
        this.handleError(response);
        return {}
      }
    } catch (e) {
      this.errorService.publish(ERRORS.API_ERROR, e);
      return {};
    }
  }

  async newReport(payload) {
    try {
      const response = await fetch(`${this.meUrl()}/reports/new`, { method: 'POST', body: JSON.stringify(payload) });
      if (response.ok) {
        const idData = await response.json();
        return [JSON.parse(idData), null];
      } else {
        if (response.status === 400) {
          const errors = await response.json();
          return [null, JSON.parse(errors)];
        }
        this.handleError(response);
        return [null, null];
      }
    } catch (e) {
      this.errorService.publish(ERRORS.API_ERROR, e);
      return [null, null];
    }
  }

  async countRepos() {
    try {
      const response = await fetch(`${this.reposUrl()}/count`);
      if (response.ok) {
        const count = await response.json();
        return JSON.parse(count).count;
      } else {
        this.handleError(response);
        return 0;
      }
    } catch (e) {
      this.errorService.publish(ERRORS.API_ERROR, e);
      return 0;
    }
  }

  async repos(pagination) {
    try {
      const queryString = Object.keys(pagination).map((key) => `${key}=${pagination[key]}`).join('&');
      const url = `${this.reposUrl()}?${queryString}`;
      const response = await fetch(url);
      if (response.ok) { 
        const repos = await response.json();
        return JSON.parse(repos);
      } else {
        this.handleError(response);
        return []
      }
    } catch (e) {
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