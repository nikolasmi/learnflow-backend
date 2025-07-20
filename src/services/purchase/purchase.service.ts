import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { error } from "console";
import { AddPurchaseDto } from "src/dtos/purchase/add.purchase.dto";
import { Purchase } from "src/entities/purchase.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Purchase)
        private readonly PurchaseRepository: Repository<Purchase>
    ) {}

    async getAll(): Promise<Purchase[]> {
        return this.PurchaseRepository.find()
    }

    async getById(purchaseId: number): Promise<Purchase | ApiResponse> {
        const purchase = await this.PurchaseRepository.findOne({where: {purchaseId: purchaseId}})
        
        if (purchase === null) {
            return new ApiResponse('error', -404, "nije pronadjena kupovina")
        }

        return purchase
    }

    async add(data: AddPurchaseDto) : Promise<Purchase | ApiResponse> {
        let newPurchase: Purchase = new Purchase()
        newPurchase.userId = data.userId
        newPurchase.courseId = data.courseId
        newPurchase.price = data.price
        newPurchase.purchasedAt = new Date()

        return new Promise((resolve => {
            this.PurchaseRepository.save(newPurchase).then(data => resolve(data)).catch(error => {
                const response: ApiResponse = new ApiResponse('error', -8001, "greska se dogodila prilikom kreiranja kupovine")
            })
        }))
    }
}