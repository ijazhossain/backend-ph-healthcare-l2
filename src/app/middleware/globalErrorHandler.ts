/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../../errorHelper/handleZodError";


export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  let errorSources:TErrorSources[]=[]
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server error";
  let stack:string|undefined=undefined;
  if(err instanceof z.ZodError){
    const simplifiedError=handleZodError(err)
    
    statusCode=simplifiedError.statusCode as number;
    message=simplifiedError.message;
    errorSources=[...simplifiedError.errorSources!]
  }else if(err instanceof Error){
    statusCode=status.INTERNAL_SERVER_ERROR;
    message=err.message;
    stack=err.stack;
  }
  const errorResponse:TErrorResponse={
    success:false,
    message:message,
    errorSources,
    stack:envVars.NODE_ENV === "development" ?stack:undefined,
    error:envVars.NODE_ENV === "development" ? err : undefined,
  }
  res.status(statusCode).json(errorResponse);
};
