import status from "http-status";
import { TErrorResponse, TErrorSources } from "../app/interfaces/error.interface";
import z from "zod";

export const handleZodError=(err:z.ZodError):TErrorResponse=>{
      const errorSources:TErrorSources[]=[]
    const statusCode: number = status.BAD_REQUEST;
  const message: string = "Zod Validation Error";
  err.issues.forEach((issue)=>{
    errorSources.push({
      path:issue.path.join(" => ") ||"unknown",
      message:issue.message
    })
  })
  return{
      success:false,
      statusCode,
    message,
    errorSources,
  }

}