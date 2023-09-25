import {expect, describe, it, beforeEach} from 'vitest'
import { compare, hash } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredencialsError } from './errors/invalid-credencials-error'

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {

    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const {user} = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be not able to authenticate with wrong email', async () => {
    await expect(() => 
    sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

  it('should be not able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })


    await expect(() => 
    sut.execute({
      email: 'johndoe@example.com',
      password: '12312312456'
    })
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })  
})