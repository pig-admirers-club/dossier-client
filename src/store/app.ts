import "reflect-metadata";
import { Container } from "inversify";
import { ApiService } from './services/api-service';
import { AppService } from './services/app-service';
import { ErrorService } from './services/error-service';
import { TYPE } from './types/types';

var container = new Container();
container.bind<AppService>(AppService).toSelf();
container.bind<ApiService>(TYPE.ApiService).to(ApiService);
container.bind<ErrorService>(TYPE.ErrorService).to(ErrorService);
export const AppStore = container.get(AppService);