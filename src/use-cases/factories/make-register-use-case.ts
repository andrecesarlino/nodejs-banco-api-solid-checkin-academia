import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "../register"

export function makeRegisterUseCase() {
  const prismaUserRepository = new PrismaUsersRepository()
  const registerUserCase = new RegisterUseCase(prismaUserRepository)

  return registerUserCase
}