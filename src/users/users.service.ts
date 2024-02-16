import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {hash, compare} from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUp:UserSignUpDto):Promise<UserEntity>{
    const userExists = this.findUserByEmail(userSignUp.email);

    if(!userExists) throw new BadRequestException('Email is not available.');

    userSignUp.password = await hash(userSignUp.password,10)

    let user=this.usersRepository.create(userSignUp);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user
  }

  async signin(userSignIn: UserSignInDto) {
    const userExists = this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email',{email:userSignIn.email}).getOne();
    if(!userExists) throw new BadRequestException('Invalid email or password');
    const matchPassword = await compare(userSignIn.password, (await userExists).password);
    if(!matchPassword) throw new BadRequestException('Invalid email or password');

    delete (await userExists).password;
    return userExists
  }
  

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity>{
    const user =  await this.usersRepository.findOneBy({id});
    if(!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email:string){
    return await this.usersRepository.findOneBy({email});
  }

  async accessToken(user:UserEntity): Promise<string>{
    return sign({
      id:user.id,
      email:user.email
    }, 
    process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIRE_TIME})
  }
}
