import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppService } from './app.service';
import { ArticleEntity } from './article/article.entity';
import { ArticleModule } from './article/article.module';
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
import { AppResolver } from './app.resolver';
import { UserService } from './user/user.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: async (userService: UserService) => ({
        include: [
          ArticleModule,
          UserModule,
          ProductModule,
          OrgModule,
          CountryModule,
          CartModule,
          CatModule,
          AppModule,
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
                    await userService.getFromToken(
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
      imports: [UserModule],
      inject: [UserService],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWOED || 'postgres',
      synchronize: true,
      entities: [
        UserEntity,
        ArticleEntity,
        ProductEntity,
        OrgEntity,
        CountryEntity,
        CartEntity,
        CatEntity,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      subscribers: [__dirname + '/subscribers/**/*{.ts,.js}'],
      migrationsTableName: 'migration_table',
    }),
    ArticleModule,
    UserModule,
    ProductModule,
    OrgModule,
    CountryModule,
    CartModule,
    CatModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
