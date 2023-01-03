import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/sign-up.input';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  // @Mutation( () => String , { name: 'login'})
  // async login(
  //   // Signin input
  //  ): Promise<any>{
  //   // return this.authService.login()
  // }

  // @Query( () => String , { name: 'revalidate'})
  // revalidate(){
  //   // return this.authService.revalidateToken()//something
  // }
}
