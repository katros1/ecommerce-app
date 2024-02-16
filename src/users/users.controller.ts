import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorators';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiBody({
       type: CreateUserDto,
       description: 'Json structure for user object',
    })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signup')
  @ApiResponse({ status: 201, description: 'You have successfully registered.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Server Error.'})
  @ApiBody({
       type: UserSignUpDto,
       description: 'Json structure for user object',
    })
  async signup(@Body() userSignUp:UserSignUpDto):Promise<{user:UserEntity}> {
    return {user: await this.usersService.signup(userSignUp)}
  }

  @Post('signin')
  @ApiResponse({ status: 200, description: 'You have successfully login.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Server Error.'})
  @ApiBody({
       type: UserSignInDto,
       description: 'Json structure for user object',
    })
  async signin(@Body() userSignin:UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity;
}> {
    const user =  await this.usersService.signin(userSignin);
    const accessToken = await this.usersService.accessToken(user);

    return {accessToken, user}
  }

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'OK'})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Server Error.'})
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  @ApiResponse({ status: 200, description: 'OK'})
  @ApiResponse({ status: 404, description: 'User Not Found'})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 500, description: 'Server Error.'})
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  @ApiResponse({ status: 200, description: 'OK'})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 500, description: 'Server Error.'})
  getProfile(@CurrentUser() currentUser:UserEntity) {
    return currentUser;
  }
}
