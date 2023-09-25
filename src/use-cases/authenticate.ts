import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredencialsError } from "./errors/invalid-credencials-error";
import { compare } from "bcrypt";
import { User } from "@prisma/client";

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRespository: UsersRepository,
  ) {}

  async execute({
    email,
    password
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRespository.findByEmail(email)

    if(!user) {
      throw new InvalidCredencialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if(!doesPasswordMatches) {
      throw new InvalidCredencialsError()
    }

    return {
      user,
    }
  }
}