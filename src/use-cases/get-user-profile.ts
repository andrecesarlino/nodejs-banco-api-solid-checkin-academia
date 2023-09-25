import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredencialsError } from "./errors/invalid-credencials-error";
import { compare } from "bcrypt";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-fond-error";

interface getUserProfileUseCaseRequest {
  userId: string
}

interface getUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {

  constructor(
    private usersRespository: UsersRepository,
  ) {}

  async execute({
    userId
  }: getUserProfileUseCaseRequest): Promise<getUserProfileUseCaseResponse> {
    const user = await this.usersRespository.findById(userId)

    if(!user) {
      throw new ResourceNotFoundError()
    }

    
    return {
      user,
    }
  }
}