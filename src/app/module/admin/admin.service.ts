import status from "http-status";
import AppError from "../../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload } from "./admin.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    include: {
      user: true,
    },
  });
  return admins;
};
const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
  return admin;
};
const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }
  const { admin } = payload;
  const updateAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...admin,
    },
  });
  return updateAdmin;
};
const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: { id },
  });
  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }
  if (isAdminExist.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You can't delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.user.update({
      where: {
        id: isAdminExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId },
    });
    await tx.account.deleteMany({
      where: {
        userId: isAdminExist.userId,
      },
    });
    const admin = await getAdminById(id);
    return admin;
  });
  return result;
};
export const adminService = { getAllAdmins, getAdminById, updateAdmin ,deleteAdmin};
