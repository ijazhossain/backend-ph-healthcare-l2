import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 character")
    .max(20, "Password must be at most 20 character"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 character")
      .max(30, "Name must be at most 30 character"),
      email: z.email("Invalid email address"),

    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters")
      .max(100, "Address must be at most 100 characters")
      .optional(),
    contactNumber: z
      .string("Contact number is required")
      .min(10, "Contact number must be at least 10 characters")
      .max(14, "Contact number must be at most 15 character"),
    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience must be an number")
      .nonnegative("Experience can not be negative"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be ether male or female",
    ),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .nonnegative("Appointment fee can not be negative"),

    qualification: z
      .string("Qualification is required")
      .min(2, "Qualification must be at least 2 characters")
      .max(50, "Qualification must be at most 50 character"),
    currentWorkingPlace: z
      .string("Current working place is required")
      .min(2, "Current working place must be at least 2 characters")
      .max(50, "Current working place must be at most 50 characters"),
    designation: z
      .string("Designation is required")
      .min(2, "Designation must be at least 2 characters")
      .max(50, "Designation must be at most 50 characters."),
  }),
  specialties: z
    .array(z.uuid(), "Specialties must be an array of strings")
    .min(1, "Specialties must be at least 1"),
});
const router = Router();
router.post(
  "/create-doctor",
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body,"Before zod validation");
    const parseResult=createDoctorZodSchema.safeParse(req.body);
    if(!parseResult.success){
        next(parseResult.error)
    }
    //sanitizing the data
    req.body=parseResult.data;
    // console.log(req.body,"After zod validation");
    next();
  },
  UserController.createDoctor,
);
/* router.post("/create-admin",UserController.createDoctor);
router.post("/create-superAdmin",UserController.createDoctor); */
export const UserRoutes = router;
