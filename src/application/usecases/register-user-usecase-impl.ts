import { RegisterUserInput, RegisterUserOutput, RegisterUserUsecase } from "@/domain/usecases/register-user-usecase";

export class RegisterUserUsecaseImpl implements RegisterUserUsecase {
  async run(input: RegisterUserInput): Promise<RegisterUserOutput> {
    throw new Error("Method not implemented.");
  }
}
