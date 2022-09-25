import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from '../interfaces/user.interface'
import { UserService } from './user.service';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { arrayBuffer } from 'stream/consumers';

@ApiTags('Users')
@Controller('user')
export class UserController {
    //require constructor to enable interaction with service.
    constructor(private userService: UserService) { }

    @Get('/')
    @ApiOkResponse({
        description:'All users found',
        schema: {
            
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'name of user'
                        },
                        email: {
                            type: 'string',
                            description: 'email of user'
                        },
                        age: {
                            type: 'number',
                            description: 'age of user'
                        },
                    },
                }
            
        }
    })
    async findAll() {
        return this.userService.find()
    }


    @Post('/Create')
    @ApiOperation({
        summary: 'User Signup',
        description: 'User signup via email.'
    })
    @ApiBody({
        type: CreateUserDto
    })
    @ApiCreatedResponse({
        description: "Create a new user",
        schema: {
            properties: {
                name: {
                    type: 'string',
                    description: 'user name'
                },
                email: {
                    type: 'string',
                    description: 'user email'
                },
                
            },
        }
    })
    async create(@Res() res, @Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }


    @Get('getuser/:email')
    @ApiParam({name: 'email'})
    async findOneUser(@Param() {email}){
        return this.userService.findOneByEmail(email);
    }
}
