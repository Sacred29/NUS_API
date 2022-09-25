import { unsaltHash } from "src/utils/crypto";
import * as mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    token: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ellipsis: String,
  });
  
  TokenSchema.pre('save', function(next) {
    const plain = this.token;
    this.ellipsis = `${plain.substr(0, 4)}...${plain.substr(plain.length - 4, 4)}`;
    this.token = unsaltHash(plain);
    next();
  });
  
  export { TokenSchema };
  