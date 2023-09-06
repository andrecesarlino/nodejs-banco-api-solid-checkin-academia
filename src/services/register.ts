import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcrypt'

interface RegisterService {
  name: string;
  email: string;
  password: string
}

export async function registerService({name, email, password}: RegisterService) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if(userWithSameEmail) {
    throw new Error('Email already exists')
  }

  const prismaUserRepository = new PrismaUsersRepository()

  await prismaUserRepository.create({
    name,
    email,
    password_hash,
  })

  
}