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
import axios from 'axios';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyProduct: Products = {
        id: 0,
        name: '',
        description: '',
        category: '',
        price: 0,
        status: '',
        user_creation: '',
        user_modification: ''
    };

    const [products, setProducts] = useState<Products[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [showMovementsDialog, setShowMovementsDialog] = useState(false);
    const [product, setProduct] = useState<Products>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState('');
    const [movementByProduct, setMovementByProduct] = useState<Products[]>([]);
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
        if (localStorage.getItem('access_token')) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
            ProductService.getProducts().then((data) => setProducts(data));
        }
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openMenuMovements = () => {
        setShowMovementsDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const hideMovementsDialog = () => {
        setShowMovementsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.id) {
            axios.put(`/product/${product.id}`, product).then((response) => {
                const _products = [...products];
                const index = findIndexById(product.id as any);
                _products[index] = product;
                setProducts(_products);
                setProductDialog(false);
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Producto actualizado',
                    life: 3000
                });
            });
        } else {
            if (product.name.trim()) {
                const { name, description, price, category } = product;
                axios
                    .post('product/', {
                        name,
                        description,
                        price,
                        category: 'Categoria'
                    })
                    .then((response) => {
                        setProducts([...products, response.data.data.product]);
                        setProductDialog(false);
                        setProduct(emptyProduct);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Producto guardado',
                            life: 3000
                        });
                    });
            }
        }
    };

    const editProduct = (product: Products) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = async (product: Products) => {
        setDeleteProductDialog(true);
        setProduct(product);
    };

    const deleteProduct = async () => {
        const response = (await axios.put(`/product/${product.id}/disable`)) as any;

        response.status !== 200 &&
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al eliminar el producto',
                life: 3000
            });

        let _products = (products as any)?.filter((val: any) => val.id !== product.id);

        setProducts(_products);

        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Producto Eliminado con éxito',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (products as any)?.length; i++) {
            if ((products as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
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

    const handleSubmitMovements = async () => {
        const response = (await ProductService.getMovementByProduct(selectedProducts.id as any)) as Products[];

        setMovementByProduct(response);

        openMenuMovements();
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };

        _product['category'] = e.value;

        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2 flex flex-wrap gap-4">
                    <Button label="Nuevo Producto" icon="pi pi-plus" severity="success" className="mr-2 w-full xl:w-auto" onClick={openNew} />
                    <Button label="Ver movimientos" icon="pi pi-eye" severity="info" className="mr-2 w-full xl:w-auto" disabled={!selectedProducts} onClick={handleSubmitMovements} />
                    <Button label="Eliminar" icon="pi pi-trash" severity="danger" className="w-full xl:w-auto" onClick={confirmDeleteSelected} disabled={!selectedProducts} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Products) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData?.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Products) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData?.name}
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Products) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData?.description}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Products) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {rowData.price as number}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Products) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Products) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
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

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label={product.id ? 'Actualizar' : 'Guardar'} icon="pi pi-check" text onClick={saveProduct} />
        </>
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
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

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
                        emptyMessage="No se encontraron productos."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="single" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Código" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Descripción" sortable body={descriptionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate} sortable></Column>
                        <Column field="category" header="Categoría" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="user_creation" header="Creado por:" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="user_modification" header="Modificado por:" sortable headerStyle={{ minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle Productos" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Description</label>
                            <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Category</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="category1"
                                        name="category"
                                        value={{
                                            id: 1,
                                            name: 'Ingreso'
                                        }}
                                        onChange={onCategoryChange}
                                        checked={product.category?.id === 1}
                                    />
                                    <label htmlFor="category1">Ingreso</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="category2"
                                        name="category"
                                        value={{
                                            id: 2,
                                            name: 'Egreso'
                                        }}
                                        onChange={onCategoryChange}
                                        checked={product.category?.id === 2}
                                    />
                                    <label htmlFor="category2">Egreso</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Price</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Estás seguro que deseas eliminar el producto <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>¿Estás seguro que deseas eliminar este registro?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={showMovementsDialog} style={{ width: '900px', margin: '40px' }} header="Movimientos del producto" modal onHide={hideMovementsDialog} resizable draggable>
                        <div className="flex align-items-center justify-content-center">
                            <DataTable value={movementByProduct} className="datatable-responsive" paginator rows={5}>
                                <Column field="id" header="Código" sortable></Column>
                                <Column field="movement_type" header="Tipo de movimiento" sortable></Column>
                                <Column field="product.name" header="Producto" sortable></Column>
                                <Column field="quantity" header="Cantidad" sortable></Column>
                                <Column field="warehouse.name" header="Bodega" sortable></Column>
                                <Column field="user_creation" header="Creado por" sortable></Column>
                                <Column field="comments" header="Comentarios" sortable></Column>
                            </DataTable>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
