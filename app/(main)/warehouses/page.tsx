/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { ProductService } from '@/demo/service/ProductService';
import { FilterMatchMode } from 'primereact/api';
import { warehouse } from '@/types/warehouses';
import axios from 'axios';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const WarehousesPage = () => {
    let emptyProduct: warehouse = {
        id: 0,
        location: '',
        name: ''
    };

    const [products, setProducts] = useState<Products[]>([]);
    const [warehouseDialog, setwarehouseDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<warehouse>(emptyProduct);
    const [productByWarehouse, setProductByWarehouse] = useState<Products[]>([]);
    const [selectedProducts, setSelectedProducts] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState<{
        global: { value: string | null; matchMode: FilterMatchMode };
    }>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductService.getWarehoses().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setwarehouseDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setwarehouseDialog(false);
        setProductByWarehouse([]);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts('');
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Productos eliminados',
            life: 3000
        });
    };

    const getProductsByWarehouse = (warehouse: warehouse) => {
        ProductService.getProductByWarehouse(warehouse.id).then((data) => setProductByWarehouse(data));
        setwarehouseDialog(true);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Ver Productos" icon="pi pi-eye" severity="info" className="mr-2" disabled={!selectedProducts} onClick={() => getProductsByWarehouse(selectedProducts as any)} />
                </div>
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: warehouse) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: warehouse) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const locationBodyTemplate = (rowData: warehouse) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.location}
            </>
        );
    };

    const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let updatedFilters = { ...filters };
        updatedFilters['global'].value = value;

        setFilters(updatedFilters);
        setGlobalFilter(value);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista de productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={onGlobalFilterChange} placeholder="Buscar..." />
            </span>
        </div>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} to {last} of {totalRecords} productos"
                        globalFilter={globalFilter}
                        filters={filters}
                        emptyMessage="No se encontraron bodegas registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Código" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Locación" sortable body={locationBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                    <Dialog visible={warehouseDialog} style={{ width: '850px' }} header="Productos por bodega" modal className="p-fluid" onHide={hideDialog}>
                        <DataTable value={productByWarehouse} className="datatable-responsive" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} pageLinkSize={3} responsiveLayout="scroll" loading={productByWarehouse.length === 0}>
                            <Column field="id" header="Código" sortable></Column>
                            <Column field="name" header="Nombre" sortable></Column>
                            <Column field="description" header="Descripción" sortable></Column>
                            <Column field="current_stock" header="Cantidad" sortable></Column>
                        </DataTable>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default WarehousesPage;
