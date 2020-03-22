import "reflect-metadata";
import { injectable } from "inversify";
import PubSub from 'pubsub-js';

@injectable()
export class ErrorService {
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

