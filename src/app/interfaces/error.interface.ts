export interface TErrorSources{
  path:string;
  message:string;
}
export interface TErrorResponse{
  success:boolean;
  statusCode?:number;
  message:string;
  stack?:string;
  errorSources:TErrorSources[];
  error?:unknown
}