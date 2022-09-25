import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { unsaltHash } from 'src/utils/crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel('Token') private readonly tokenModel: Model<any>,
        private readonly userService: UserService,

    ) { }

    async findOneByToken(token: string) {
        // token is hashed w/o salt in DB to protect tokens in the event of DB attack
        const hash = unsaltHash(token);
        const tokenEntity = await this.tokenModel.findOne({ token: hash });
        if (!tokenEntity) throw new Error('Token not found');
        return this.userService.findOneById(tokenEntity.owner);
    }

    async create(userId) {
        const tokenInfo = await this.tokenModel.findOne({ owner: userId });
        if (tokenInfo) {
            await this.tokenModel.deleteOne({ owner: userId });
        }
        const token = uuidv4();
        const createToken = new this.tokenModel({ token, owner: userId });
        await createToken.save();
        return { token };
    }
}
