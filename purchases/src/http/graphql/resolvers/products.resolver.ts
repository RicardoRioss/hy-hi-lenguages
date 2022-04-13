import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ProductsServices } from '../../../services/products.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CreateProductInput } from '../inputs/create-product-input';

import { Product } from '../models/product';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productService: ProductsServices) {}
  // Pesquisar
  @Query(() => [Product])
  //@UseGuards(AuthorizationGuard)
  products() {
    return this.productService.listAllProducts();
  }

  // Criar
  @UseGuards(AuthorizationGuard)
  @Mutation(() => Product)
  createProduct(@Args('data') data: CreateProductInput) {
    return this.productService.createProduct(data);
  }
}
