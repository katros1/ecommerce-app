import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        example: 'Furniture',
        required: true
     })
    @IsNotEmpty({message: 'title can not be empty'})
    @IsString({message:'title shoul be string'})
    title:string;

    @ApiProperty({
        example: 'Description about  furniture category ',
        required: true
     })
    @IsNotEmpty({message: 'description can not be empty'})
    @IsString({message:'description shoul be string'})
    description:string;

}
