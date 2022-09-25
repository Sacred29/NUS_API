import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UserService {
    private readonly user:User[]=[];
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        //@InjectModel('User') private userModel:Model<UserDocument>
    ) {}


    async find(){
        return this.userModel.find()
    }

    async create(createUserDto:CreateUserDto) {
        const createUser = new this.userModel(createUserDto);
        await createUser.save();

        return {email: createUser.email, name: createUser.name}
    }

    async findOneUserViaEmail(userEmail:string): Promise<User>{
        return this.userModel.findOne({email: userEmail}).exec();
    }
    async findOneByEmail(userEmail: string){
        return this.userModel.findOne({email:userEmail});
    }

    async findOneById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
      }
}
