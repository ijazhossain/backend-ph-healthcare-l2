/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppointmentStatus } from "../../../generated/prisma/enums"
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { IBookAppointmentPayload } from "./appointment.interface"

const bookAppointment=async(payload : IBookAppointmentPayload, user : IRequestUser)=>{}
const getMyAppointments=async(user: IRequestUser)=>{}
const changeAppointmentStatus=async(appointmentId: string, appointmentStatus: AppointmentStatus, user: IRequestUser)=>{}
const getMySingleAppointment=async(appointmentId: string, user: IRequestUser)=>{}
const getAllAppointments=async()=>{}
const bookAppointmentWithPayLater=async(payload : IBookAppointmentPayload, user : IRequestUser)=>{}
const initiatePayment=async(appointmentId: string, user : IRequestUser)=>{}
const cancelUnpaidAppointments=async()=>{}
export const AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments,
}