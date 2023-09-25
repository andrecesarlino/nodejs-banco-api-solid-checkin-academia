import {expect, describe, it} from 'vitest'
import { compare, hash } from 'bcrypt'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredencialsError } from './errors/invalid-credencials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6)
    })

    const {user} = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    await expect(user.id).toEqual(expect.any(String))
  })

  it('should be not able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await expect(() => 
    sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

  it('should be not able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

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