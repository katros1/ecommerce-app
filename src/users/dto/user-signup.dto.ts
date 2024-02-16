import { IsNotEmpty, MinLength } from "class-validator";
import { UserSignInDto } from "./user-signin.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserSignUpDto extends UserSignInDto {
    @ApiProperty({
        example: 'Tom Done',
        required: true
     })
    @IsNotEmpty({message: 'Name can not be null'})
    @IsNotEmpty({message: 'Name should be string'})
    name:string;

}