// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { StoreTypeListComponent } from './Components/StoreType/store-type-list/store-type-list.component';
import { StoreTypeFormComponent } from './Components/StoreType/store-type-form/store-type-form.component';
import { RoleCreateComponent } from './Components/Role/role-create/role-create.component';
import { RoleListComponent } from './Components/Role/role-list/role-list.component';
import { CategoryListComponent } from './Components/Category/category-list/category-list.component';
import { CategoryFormComponent } from './Components/Category/category-form/category-form.component';
import { SuppliersListComponent } from './Components/Suppliers/suppliers-list/suppliers-list.component';
import { SuppliersFormComponent } from './Components/Suppliers/suppliers-form/suppliers-form.component';
import { MenuFormComponent } from './Components/Config/Menu/menu-form/menu-form.component';
import { MenuListComponent } from './Components/Config/Menu/menu-list/menu-list.component';
import { RegisterLandingComponent } from './Components/Register/register-landing/register-landing.component';
import { RegisterPackageComponent } from './Components/Register/register-package/register-package.component';
import { RegisterCompleteComponent } from './Components/Register/register-complete/register-complete.component';
import { MenuPermissionFormComponent } from './Components/Config/MenuPermission/menu-permission-form/menu-permission-form.component';
import { RegisterMailVerifyComponent } from './Components/Register/register-mail-verify/register-mail-verify.component';
import { UserListComponent } from './Components/Config/User/user-list/user-list.component';
import { UserFormComponent } from './Components/Config/User/user-form/user-form.component';
import { StListComponent } from './Components/MasterSetup/StoreType/st-list/st-list.component';
import { StFormComponent } from './Components/MasterSetup/StoreType/st-form/st-form.component';
import { CatagoryFormComponent } from './Components/MasterSetup/Category/catagory-form/catagory-form.component';
import { CatagoryListComponent } from './Components/MasterSetup/Category/catagory-list/catagory-list.component';
import { BankListComponent } from './Components/MasterSetup/Bank/bank-list/bank-list.component';
import { BankFormComponent } from './Components/MasterSetup/Bank/bank-form/bank-form.component';
import { BmListComponent } from './Components/MasterSetup/BusinessMaster/bm-list/bm-list.component';
import { BmFormComponent } from './Components/MasterSetup/BusinessMaster/bm-form/bm-form.component';
import { UnitListComponent } from './Components/MasterSetup/Unit/unit-list/unit-list.component';
import { UnitFormComponent } from './Components/MasterSetup/Unit/unit-form/unit-form.component';
import { ProductsListComponent } from './Components/Products/products-list/products-list.component';
import { ProductsFormComponent } from './Components/Products/products-form/products-form.component';
import { PurchaseTypeListComponent } from './Components/Config/PurchaseType/purchase-type-list/purchase-type-list.component';
import { PurchaseTypeFormComponent } from './Components/Config/PurchaseType/purchase-type-form/purchase-type-form.component';
import { PurchaseOrderListComponent } from './Components/PO/PurchaseOrder/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './Components/PO/PurchaseOrder/purchase-order-form/purchase-order-form.component';
import { PurformaInvoiceListComponent } from './Components/Purchase/PI/purforma-invoice-list/purforma-invoice-list.component';
import { PurformaInvoiceFormComponent } from './Components/Purchase/PI/purforma-invoice-form/purforma-invoice-form.component';
import { LcRequestListComponent } from './Components/Purchase/LC/lc-request-list/lc-request-list.component';
import { LcRequestFormComponent } from './Components/Purchase/LC/lc-request-form/lc-request-form.component';
import { ShipmentListComponent } from './Components/Purchase/shipment/shipment-list/shipment-list.component';
import { ShipmentFormComponent } from './Components/Purchase/shipment/shipment-form/shipment-form.component';
import { GoodsReceivedListComponent } from './Components/Purchase/GoodsReceived/goods-received-list/goods-received-list.component';
import { GoodsReceivedFormComponent } from './Components/Purchase/GoodsReceived/goods-received-form/goods-received-form.component';
import { BillEntryListComponent } from './Components/Purchase/Bill/bill-entry-list/bill-entry-list.component';
import { BillEntryFormComponent } from './Components/Purchase/Bill/bill-entry-form/bill-entry-form.component';
import { PaymentVoucherListComponent } from './Components/Purchase/Payment/payment-voucher-list/payment-voucher-list.component';
import { PaymentVoucherFormComponent } from './Components/Purchase/Payment/payment-voucher-form/payment-voucher-form.component';
import { PendingorderListComponent } from './Components/Orders/pendingorder-list/pendingorder-list.component';
import { OrderListComponent } from './Components/Orders/order-list/order-list.component';
import { OrderFormComponent } from './Components/Orders/order-form/order-form.component';
import { CustomerListComponent } from './Components/Customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './Components/Customer/customer-form/customer-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/auth/signin',
        pathMatch: 'full'
      },

      {
        path: 'analytics',
        loadComponent: () => import('./demo/dashboard/dash-analytics.component')
      },
      {
        path: 'component',
        loadChildren: () => import('./demo/ui-element/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/chart & map/core-apex.component')
      },
      {
        path: 'forms',
        loadComponent: () => import('./demo/forms & tables/form-elements/form-elements.component')
      },
      {
        path: 'tables',
        loadComponent: () => import('./demo/forms & tables/tbl-bootstrap/tbl-bootstrap.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/sample-page/sample-page.component')
      },
       {
        path: 'roleForm',
        component: RoleCreateComponent
      },
      {
        path: 'roleList',
        component: RoleListComponent
      },  {
        path: 'suppliersList',
        component: SuppliersListComponent
      }, {
        path: 'suppliersForm',
        component: SuppliersFormComponent
      }, {
        path: 'menuList',
        component: MenuListComponent
      }
      , {
        path: 'menuForm',
        component: MenuFormComponent
      }
      , {
        path: 'menuPermission',
        component: MenuPermissionFormComponent
      }, {
        path: 'userList',
        component: UserListComponent
      }
      , {
        path: 'userForm',
        component: UserFormComponent
      },
      {
        path: 'storetypeList',
        component: StListComponent
      },
      {
        path: 'storetypeForm',
        component: StFormComponent
      },
      {
        path: 'categoryList',
        component: CatagoryListComponent
      }, {
        path: 'categoryForm',
        component: CatagoryFormComponent
      },

      {
        path: 'bankList',
        component: BankListComponent
      }, {
        path: 'bankForm',
        component: BankFormComponent
      },

      {
        path: 'bmList',
        component: BmListComponent
      }, {
        path: 'bmForm',
        component: BmFormComponent
      },

      {
        path: 'categoryList',
        component: CatagoryListComponent
      }, {
        path: 'categoryForm',
        component: CatagoryFormComponent
      },

      {
        path: 'categoryList',
        component: CatagoryListComponent
      }, {
        path: 'categoryForm',
        component: CatagoryFormComponent
      },
      {
        path: 'unitList',
        component: UnitListComponent
      },
      {
        path: 'unitForm',
        component: UnitFormComponent
      },
      {
        path:'productsList',
        component:ProductsListComponent
      },
      {
        path:'productsForm',
        component:ProductsFormComponent
      }
      ,
      {
        path:'purchaseTypeList',
        component:PurchaseTypeListComponent
      },
      {
        path:'purchaseTypeForm',
        component:PurchaseTypeFormComponent
      }
      ,
      {
        path:'purchaseOrderList',
        component:PurchaseOrderListComponent
      },
      {
        path:'purchaseOrderForm',
        component:PurchaseOrderFormComponent
      },
      
      {
        path: 'PurformaInvoiceList',
        component: PurformaInvoiceListComponent
      }, {
        path: 'PurformaInvoiceForm',
        component: PurformaInvoiceFormComponent
      },

      {
        path: 'LcRequestList',
        component: LcRequestListComponent
      }, {
        path: 'LcRequestForm',
        component: LcRequestFormComponent
      },
      {
        path: 'ShipmentList',
        component: ShipmentListComponent
      },
      {
        path: 'ShipmentForm',
        component: ShipmentFormComponent
      },
      {
        path:'GoodsReceivedList',
        component:GoodsReceivedListComponent
      },
      {
        path:'GoodsReceivedForm',
        component:GoodsReceivedFormComponent
      }
      ,
      {
        path:'BillEntryList',
        component:BillEntryListComponent
      },
      {
        path:'BillEntryForm',
        component:BillEntryFormComponent
      }
      ,
      {
        path:'PaymentVoucherList',
        component:PaymentVoucherListComponent
      },
      {
        path:'PaymentVoucherForm',
        component:PaymentVoucherFormComponent
      },
      {
        path:"orderPList",
        component:PendingorderListComponent
      },
      {
        path:"orderList",
        component:OrderListComponent
      },
      {
        path:"orderForm",
        component:OrderFormComponent
      },
      {
        path:"customerList",
        component:CustomerListComponent
      },
      {
        path:"customerForm",
        component:CustomerFormComponent
      }


      



    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent: () => import('./demo/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./demo/authentication/sign-in/sign-in.component')
      },{
        path:'auth/register-landing',
        component: RegisterLandingComponent
      }
      ,{
        path:'auth/register-package/:id',
        component: RegisterPackageComponent
      },{
        path:'auth/register-complete/:id',
        component: RegisterCompleteComponent
      },
      {
        path:'auth/register-verify',
        component:RegisterMailVerifyComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
