import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile , Res } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {Response} from "express";

const storage = diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      const fileExt = file?.mimetype?.split("/")[1];
      const fileGen = `${Date.now()}.${fileExt}`;
      cb(null, fileGen);
    }
  });

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @UseInterceptors(FileInterceptor("image", {
    storage: storage
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(file, createProfileDto);
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.profileService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string , @Res() res: Response) {
    return this.profileService.findOne(+id , res);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor("Image", {
    storage: storage
  }))
  update(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto , @Res() res: Response) {
    return this.profileService.update(file, +id, updateProfileDto , res);
  }

  @Delete(':id')
  remove(@Param('id') id: string , @Res() res: Response) {
    return this.profileService.delete(+id , res);
  }
}
