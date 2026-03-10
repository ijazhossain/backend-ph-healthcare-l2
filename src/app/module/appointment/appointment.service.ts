/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppointmentStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./appointment.interface";
import { v7 as uuidv7 } from "uuid";

const bookAppointment = async (
  payload: IBookAppointmentPayload,
  user: IRequestUser,
) => {
  const patientData = await prisma.patient.findFirstOrThrow({
    where: {
      email: user.email,
    },
  });
  const doctorData = await prisma.doctor.findFirstOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });
  const scheduleData = await prisma.schedule.findFirstOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  const doctorSchedule = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId: scheduleData.id,
      },
    },
  });
  const videoCallingId = String(uuidv7());
  const result = await prisma.$transaction(async(tx)=>{
    const appointmentData=await tx.appointment.create({
        data:{
            doctorId:payload.doctorId,
            patientId:patientData.id,
            scheduleId:doctorSchedule.scheduleId,
            videoCallingId:videoCallingId,
        }
    })
    await tx.doctorSchedules.update({
        where:{
            doctorId_scheduleId:{
                doctorId:payload.doctorId,
                scheduleId:payload.scheduleId,
            }
        },
        data:{
            isBooked:true,
        }
    });
    //TODO PAYMENT INTEGRATION IS HERE
    const transactionId=String(uuidv7())
    const paymentData=await tx.payment.create({
        data:{
            appointmentId:appointmentData.id,
            amount:doctorData.appointmentFee,
            transactionId
        }
    });
 return {
            appointmentData,
            paymentData,
            //  paymentUrl: session.url,
        };
  })
  return {
        appointment: result.appointmentData,
        payment: result.paymentData,
        // paymentUrl: result.paymentUrl,
    };
};
const getMyAppointments = async (user: IRequestUser) => {};
const changeAppointmentStatus = async (
  appointmentId: string,
  appointmentStatus: AppointmentStatus,
  user: IRequestUser,
) => {};
const getMySingleAppointment = async (
  appointmentId: string,
  user: IRequestUser,
) => {};
const getAllAppointments = async () => {};
const bookAppointmentWithPayLater = async (
  payload: IBookAppointmentPayload,
  user: IRequestUser,
) => {};
const initiatePayment = async (appointmentId: string, user: IRequestUser) => {};
const cancelUnpaidAppointments = async () => {};
export const AppointmentService = {
  bookAppointment,
  getMyAppointments,
  changeAppointmentStatus,
  getMySingleAppointment,
  getAllAppointments,
  bookAppointmentWithPayLater,
  initiatePayment,
  cancelUnpaidAppointments,
};
