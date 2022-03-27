import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './apis/user/user.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './apis/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ArtModule } from './apis/art/art.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { BoardModule } from './apis/board/board.module';
import { CommentModule } from './apis/comment/comment.module';
import { ProfileModule } from './apis/profile/profile.module';
import { HistoryModule } from './apis/history/history.module';

@Module({
  imports: [
    ArtModule,
    AuthModule,
    BoardModule,
    CommentModule,
    HistoryModule,
    ProfileModule,
    UserModule,
    PointTransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: { origin: 'http://localhost:3000', credential: true },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_database',
      port: 3306,
      username: 'root',
      password: '3160',
      database: 'ars',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      timezone: 'Asia/seoul',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my_redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
