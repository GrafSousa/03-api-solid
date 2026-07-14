import { hash } from 'bcryptjs';

import { type UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSamePassword = await this.usersRepository.findByEmail(email);

    if (userWithSamePassword) {
      throw new UserAlreadyExistsError();
    }

    await this.usersRepository.create({
      email,
      name,
      password_hash,
    });
  }
}
