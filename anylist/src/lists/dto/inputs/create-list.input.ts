import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../../users/entities/user.entity';

@InputType()
export class CreateListInput {
  
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

}
