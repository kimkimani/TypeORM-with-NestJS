import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import * as fs from "fs/promises";
import * as path from 'path';
 
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>
  ) { }

  create(file: Express.Multer.File, createProfileDto: CreateProfileDto) {
    const { userName, userAge } = createProfileDto;
    const profile = this.profileRepository.create({
        userName: userName,
        userAge: userAge,
      profileImage: file?.filename,
    });
    return this.profileRepository.save(profile);
  }


  async findAll(res: Response) {
    const profile = await this.profileRepository.find();
    if (profile.length !== 0) {
      return res.status(200).json(profile);
    }
    return res.status(404).json({ msg: "profile not found." });
  }

  async findOne(id: number, res: Response) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (profile) {
      return res.status(200).json(profile);
    }
    return res.status(404).json({ msg: "profile not found." });
  }

  async update(file: Express.Multer.File, id: number, updateProfileDto: UpdateProfileDto, res: Response) {
    const { userName, userAge } = updateProfileDto;
    const profile = await this.profileRepository.findOneBy({ id });
    if (profile) {
      if (file) {
        await fs.unlink(path.join(process.cwd(), `./images/${profile.profileImage}`));
        await this.profileRepository.update(
          {
            id: id
          },
          {
            userName: userName,
            userAge: userAge,
            profileImage: file?.filename,
          }
        );
        return res.status(200).json({ msg: "profile updated successfully." });
      }

      await this.profileRepository.update(
        {
          id: id
        },
        {
          userName: userName,
          userAge: userAge,
        }
      );
      return res.status(200).json({ msg: "profile updated successfully." });
    }
    return res.status(404).json({ msg: "profile not found." });
  }

  async delete(id: number, res: Response) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (profile) {
      await fs.unlink(path.join(process.cwd(), `./images/${profile.profileImage}`));
      await this.profileRepository.delete(id);
      return res.status(200).json({ msg: "profile deleted successfully." });
    }
    return res.status(404).json({ msg: "profile not found." });
  }
}