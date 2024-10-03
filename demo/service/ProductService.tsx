import { Demo, Products } from '@/types';
import axios from 'axios';

export const ProductService = {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    async getProducts() {
        const response = await axios.get('/product/');

        return response.data.data.products as Products.Products[];
    },

    async getWarehoses() {
        const response = await axios.get('/warehouse/');

        return response.data.data.warehouses as Products.Warehouses[];
    },

    async getProductByWarehouse(warehouseId: number) {
        const response = await axios.get(`/product/warehouse/${warehouseId}`);

        return response.data.data.products as Products.Products[];
    },

    async getMovementByProduct(productId: number) {
        const response = await axios.get(`/movement/product/${productId}`);

        return response.data.data.movements as Products.Movements[];
    },

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};
