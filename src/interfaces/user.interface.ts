import { Document } from "mongoose";

export interface User {
    readonly name: string;
    readonly email: string;
    readonly age: number;
    readonly _id:string;
    password:string;

}
