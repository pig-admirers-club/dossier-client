export enum ERRORS {
  API_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR
}
export const TYPE = {
  ApiService: Symbol.for("ApiService"),
  ErrorService: Symbol.for("ErrorService")
}
