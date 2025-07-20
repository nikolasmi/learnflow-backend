import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AddPurchaseDto } from "src/dtos/purchase/add.purchase.dto";
import { Purchase } from "src/entities/purchase.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { PurchaseService } from "src/services/purchase/purchase.service";

@Controller('api/purchase')
export class PurchaseController {
    constructor(
        private readonly purchaseService: PurchaseService
    ) {}

    @Get()
    getAll(): Promise<Purchase[] | ApiResponse> {
        return this.purchaseService.getAll()
    }

    @Get(':id')
    getById(@Param('id') purchaseId: number): Promise<Purchase | ApiResponse> {
        return new Promise(async (resolve) => {
            let purchase = await this.purchaseService.getById(purchaseId)
            if (purchase === null) {
                resolve(new ApiResponse('error', -8002, "kupovina sa datim id nije pronadjen"))
            }
            resolve(purchase)
        })
    }

    @Post()
    add(@Body() data: AddPurchaseDto): Promise<Purchase | ApiResponse> {
        return this.purchaseService.add(data)
    }
}