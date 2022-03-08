import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CountryEntity } from './country/country.entity';
import { CountryModule } from './country/country.module';
import { OrgEntity } from './org/org.entity';
import { OrgModule } from './org/org.module';
import { CartModule } from './product/cart.module';
import { CatModule } from './product/cat.module';
import { CatEntity } from './product/entities/cat.entity';
import { CartEntity, ProductEntity } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { FunnyModule } from './funny/funny.module';
import { JwtAuthGuard, LevelGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { ImagesEntity } from './images/images.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (authService: AuthService) => ({
        include: [
          UserModule,
          ProductModule,
          OrgModule,
          CountryModule,
          CartModule,
          CatModule,
          AppModule,
          AuthModule,
          NotificationModule,
          FunnyModule,
        ],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: ({ req, connection }) => ({
          req,
          connection,
        }),
        sortSchema: true,
        playground: true,
        debug: true,
        cors: true,
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: async (connectionParams) => {
              console.log('Подключение');
              let context: {} = { websocketHeader: { connectionParams } };
              console.log(connectionParams.Authorization);
              if (connectionParams.Authorization)
                context = {
                  ...context,
                  user: (
                    await authService.getFromToken(
                      connectionParams.Authorization.split(' ')[1],
                    )
                  ).item,
                };
              return context;
            },
            onDisconnect: () => {
              console.log('Отключение');
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      synchronize: true,
      entities: [
        UserEntity,
        ProductEntity,
        OrgEntity,
        CountryEntity,
        CartEntity,
        CatEntity,
        ImagesEntity,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
      migrationsTableName: 'migration_table',
    }),
    UserModule,
    ProductModule,
    OrgModule,
    CountryModule,
    CartModule,
    CatModule,
    FunnyModule,
    NotificationModule,
    AuthModule,
  ],
  providers: [
    {
      useClass: LevelGuard,
      provide: APP_GUARD,
    },
    {
      useClass: JwtAuthGuard,
      provide: APP_GUARD,
    },
  ],
})
export class AppModule {}
