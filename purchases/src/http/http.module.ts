import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { DatabaseModule } from '../database/database.module';
import { MessagingModule } from '../messaging/messaging.module';
import { CustomersService } from '../services/customers.service';
import { ProductsServices } from '../services/products.service';
import { PurchasesService } from '../services/purchases.service';
import { CustomerResolver } from './graphql/resolvers/customers.resolver';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import { PurchasesResolver } from './graphql/resolvers/purchases.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MessagingModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
    }),
  ], // Faz com que o módulo http leia o arquivo .env de forma automatica/ podemos acessar através de process.env
  providers: [
    // Resolvers
    ProductsResolver,
    PurchasesResolver,
    CustomerResolver,

    //Services
    ProductsServices,
    PurchasesService,
    CustomersService,
  ],
})
export class HttpModule {}
