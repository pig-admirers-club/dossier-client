export enum ERRORS {
  API_ERROR,
  UNAUTHORIZED
}
export const TYPE = {
  ApiService: Symbol.for("ApiService"),
  ErrorService: Symbol.for("ErrorService")
}
