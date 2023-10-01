import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Use 'mysql' for MySQL
      host: 'localhost',
      port: 3306, // Default MySQL port
      username: 'root',
      password: 'kimafro',
      database: 'profile',
      entities: [Profile],
      synchronize: true, // Set to false in production
    }),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
