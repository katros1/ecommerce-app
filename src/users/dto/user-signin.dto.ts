import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class UserSignInDto {

    @ApiProperty({
        example: 'example@gmail.com',
        required: true
     })
    @IsNotEmpty({message: 'email can not be empty'})
    @IsEmail({}, {message: 'email must be valid'})
    email:string;

    @ApiProperty({
        example: '12345',
        required: true
     })
    @IsNotEmpty({message: 'password can not be null'})
    @MinLength(5,{message: 'password minimum character shoubld be 5'})
    password:string;
}