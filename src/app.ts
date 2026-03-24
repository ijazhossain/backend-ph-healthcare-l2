/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from "express";
import cron from "node-cron";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";
import { PaymentController } from "./app/module/payment/payment.controller";
import { AppointmentService } from "./app/module/appointment/appointment.service";
const app: Application = express();
//qs
app.set("query parser", (str: string) => qs.parse(str));
//ejs set up
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
//stripe webhook
/* app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log("webhook received", req.body);
    res.status(200).json({ received: true });
  },
); */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.use(
  cors({
    origin: [
      envVars.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//auth route for better auth
app.use("/api/auth", toNodeHandler(auth));
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

//for node-corn
cron.schedule("*/25 * * * *", async () => {
    try {
        console.log("Running cron job to cancel unpaid appointments...");
        await AppointmentService.cancelUnpaidAppointments();
    } catch (error : any) {
        console.error("Error occurred while canceling unpaid appointments:", error.message);    
    }
})
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoutes);
// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});
//global error handler
app.use(globalErrorHandler);
app.use(notFound);
export default app;
