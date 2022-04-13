/* eslint-disable prettier/prettier */
import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductsServices } from '../../../services/products.service';

import { PurchasesService } from '../../../services/purchases.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { Product } from '../models/product';

import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productService: ProductsServices,
    ) {}
  // Pesquisar
  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField()
  product(
    @Parent() purchase: Purchase,
  ) {
    return this.productService.getProductById(purchase.productId)
  }
}
