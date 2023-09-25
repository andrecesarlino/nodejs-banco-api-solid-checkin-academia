import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredencialsError } from '@/use-cases/errors/invalid-credencials-error'
import { FastifyRequest, FastifyReply } from 'fastify'
import {z} from 'zod'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const {email,password} = authenticateBodySchema.parse(request.body)

  try {
    const prismaUserRepository = new PrismaUsersRepository()
    const authenticateUserCase = new AuthenticateUseCase(prismaUserRepository)

    await authenticateUserCase.execute({
      email,
      password,
    })
  } catch (err) {
    if(err instanceof InvalidCredencialsError) {
      return reply.status(400).send({message: err.message})
    }
    throw err
    //return reply.status(500).send()
  }

  return reply.status(200).send()
}