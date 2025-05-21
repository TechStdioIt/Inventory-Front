// Angular Import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { ChatMsgComponent } from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ChatUserListComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { SharedModule } from './theme/shared/shared.module';
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxFormModule,
  DxListModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTemplateModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxTooltipModule,
  DxTreeViewModule,
  DxDateBoxModule,
  DxTagBoxModule,
  DxSchedulerModule,
  DxLoadPanelModule,
  DevExtremeModule,
  DxAccordionModule,
  DxDropDownBoxModule,
  DxScrollViewModule,
  DxContextMenuModule,
  DxDrawerModule,
  DxRadioGroupModule,
  DxTabsModule,
  DxChartModule,
  DxActionSheetModule,
  DxFileUploaderModule,
  DxProgressBarModule,
  DxPopoverModule,
  DxLoadIndicatorModule,
  DxTabPanelModule,
  DxSortableModule
} from 'devextreme-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreTypeListComponent } from './Components/StoreType/store-type-list/store-type-list.component';
import { StoreTypeFormComponent } from './Components/StoreType/store-type-form/store-type-form.component';
import { CommonDataGridComponent } from './CommonComponents/CommonDataGrid/common-data-grid.component';
import { CommonDataGridWithCheckBoxComponent } from './CommonComponents/CommonDataGridWithCheckBox/common-data-grid-with-check-box.component';
import { ButtonControlComponent } from './CommonComponents/button-control/button-control.component';
import { ToastrModule } from 'ngx-toastr';
import { SideBarComponent } from './theme/layout/side-bar/side-bar.component';
import { RoleListComponent } from './Components/Role/role-list/role-list.component';
import { RoleCreateComponent } from './Components/Role/role-create/role-create.component';
import { CategoryFormComponent } from './Components/Category/category-form/category-form.component';
import { CategoryListComponent } from './Components/Category/category-list/category-list.component';
import { SuppliersListComponent } from './Components/Suppliers/suppliers-list/suppliers-list.component';
import { SuppliersFormComponent } from './Components/Suppliers/suppliers-form/suppliers-form.component';
import { MenuListComponent } from './Components/Config/Menu/menu-list/menu-list.component';
import { MenuFormComponent } from './Components/Config/Menu/menu-form/menu-form.component';
import { MenuPermissionFormComponent } from './Components/Config/MenuPermission/menu-permission-form/menu-permission-form.component';
import { RegisterLandingComponent } from './Components/Register/register-landing/register-landing.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RegisterMailVerifyComponent } from './Components/Register/register-mail-verify/register-mail-verify.component';
import { CommonSelectBoxComponent } from './CommonComponents/common-select-box/common-select-box.component';
import { DynamicGridWithPaginationComponent } from './CommonComponents/dynamic-grid-with-pagination/dynamic-grid-with-pagination.component';
import { BankFormComponent } from './Components/MasterSetup/Bank/bank-form/bank-form.component';
import { BankListComponent } from './Components/MasterSetup/Bank/bank-list/bank-list.component';
import { BmFormComponent } from './Components/MasterSetup/BusinessMaster/bm-form/bm-form.component';
import { BmListComponent } from './Components/MasterSetup/BusinessMaster/bm-list/bm-list.component';
import { CatagoryFormComponent } from './Components/MasterSetup/Category/catagory-form/catagory-form.component';
import { CatagoryListComponent } from './Components/MasterSetup/Category/catagory-list/catagory-list.component';
import { StFormComponent } from './Components/MasterSetup/StoreType/st-form/st-form.component';
import { StListComponent } from './Components/MasterSetup/StoreType/st-list/st-list.component';
import { UnitFormComponent } from './Components/MasterSetup/Unit/unit-form/unit-form.component';
import { UnitListComponent } from './Components/MasterSetup/Unit/unit-list/unit-list.component';
import { WhFormComponent } from './Components/MasterSetup/WareHouse/wh-form/wh-form.component';
import { WhListComponent } from './Components/MasterSetup/WareHouse/wh-list/wh-list.component';
import { UserListComponent } from './Components/Config/User/user-list/user-list.component';
import { UserFormComponent } from './Components/Config/User/user-form/user-form.component';
import { AuthInterceptor } from './Authorization/AuthInterceptor';
import { DatePipe } from '@angular/common';
import { ProductsListComponent } from './Components/Products/products-list/products-list.component';
import { ProductsFormComponent } from './Components/Products/products-form/products-form.component';
import { PurchaseTypeFormComponent } from './Components/Config/PurchaseType/purchase-type-form/purchase-type-form.component';
import { PurchaseTypeListComponent } from './Components/Config/PurchaseType/purchase-type-list/purchase-type-list.component';
import { PurchaseOrderFormComponent } from './Components/PO/PurchaseOrder/purchase-order-form/purchase-order-form.component';
import { PurchaseOrderListComponent } from './Components/PO/PurchaseOrder/purchase-order-list/purchase-order-list.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PurformaInvoiceListComponent } from './Components/Purchase/PI/purforma-invoice-list/purforma-invoice-list.component';
import { PurformaInvoiceFormComponent } from './Components/Purchase/PI/purforma-invoice-form/purforma-invoice-form.component';
import { LcRequestFormComponent } from './Components/Purchase/LC/lc-request-form/lc-request-form.component';
import { LcRequestListComponent } from './Components/Purchase/LC/lc-request-list/lc-request-list.component';
import { ShipmentListComponent } from './Components/Purchase/shipment/shipment-list/shipment-list.component';
import { ShipmentFormComponent } from './Components/Purchase/shipment/shipment-form/shipment-form.component';
import { GoodsReceivedListComponent } from './Components/Purchase/GoodsReceived/goods-received-list/goods-received-list.component';
import { GoodsReceivedFormComponent } from './Components/Purchase/GoodsReceived/goods-received-form/goods-received-form.component';
import { BillEntryListComponent } from './Components/Purchase/Bill/bill-entry-list/bill-entry-list.component';
import { BillEntryFormComponent } from './Components/Purchase/Bill/bill-entry-form/bill-entry-form.component';
import { PaymentVoucherListComponent } from './Components/Purchase/Payment/payment-voucher-list/payment-voucher-list.component';
import { PaymentVoucherFormComponent } from './Components/Purchase/Payment/payment-voucher-form/payment-voucher-form.component';
import { OrderListComponent } from './Components/Orders/order-list/order-list.component';
import { OrderFormComponent } from './Components/Orders/order-form/order-form.component';
import { PendingorderListComponent } from './Components/Orders/pendingorder-list/pendingorder-list.component';
import { DoListComponent } from './Components/DeliveryOrder/do-list/do-list.component';
import { DoFormComponent } from './Components/DeliveryOrder/do-form/do-form.component';
import { DopendingListComponent } from './Components/DeliveryOrder/dopending-list/dopending-list.component';
import { IntpendingListComponent } from './Components/Invoice/intpending-list/intpending-list.component';
import { InvFormComponent } from './Components/Invoice/inv-form/inv-form.component';
import { InvListComponent } from './Components/Invoice/inv-list/inv-list.component';
import { MrFormComponentss } from './Components/MoneyReceipt/mr-form/mr-form.component';
import { MrListComponent } from './Components/MoneyReceipt/mr-list/mr-list.component';
import { MrpendingListComponent } from './Components/MoneyReceipt/mrpending-list/mrpending-list.component';
import { CommonAutoCompleteApiComponent } from './CommonComponents/common-auto-complete-api/common-auto-complete-api.component';
import { CustomerFormComponent } from './Components/Customer/customer-form/customer-form.component';
import { CustomerListComponent } from './Components/Customer/customer-list/customer-list.component';
import { InvoiceListComponent } from './Components/Invoice/invoice-list/invoice-list.component';
import { InvoiceFormComponent } from './Components/Invoice/invoice-form/invoice-form.component';
import { PaymentReceiveListComponent } from './Components/PaymentReceive/payment-receive-list/payment-receive-list.component';
import { PaymentReceiveFormComponent } from './Components/PaymentReceive/payment-receive-form/payment-receive-form.component';
import { DeliveryOrderListComponent } from './Components/DeliveryOrder/delivery-order-list/delivery-order-list.component';
import { DeliveryOrderFormComponent } from './Components/DeliveryOrder/delivery-order-form/delivery-order-form.component';
import { DeliveryOrderPendingListComponent } from './Components/DeliveryOrder/delivery-order-pending-list/delivery-order-pending-list.component';
import { ProductDiscountListComponent } from './Components/ProductDiscount/product-discount-list/product-discount-list.component';
import { ProductDiscountFormComponent } from './Components/ProductDiscount/product-discount-form/product-discount-form.component';
import { SalesFormComponent } from './Components/Orders/sales-form/sales-form.component';
import { ReportViewerComponent } from './Components/Reports/report-viewer/report-viewer.component';
import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { BrandFormComponent } from './Components/Brands/brand-form/brand-form.component';
import { BrandListComponent } from './Components/Brands/brand-list/brand-list.component';
import { PrintLabelListComponent } from './Components/PrintLabel/print-label-list/print-label-list.component';
import { BranchListComponent } from './Components/MasterSetup/Branch/branch-list/branch-list.component';
import { BranchFormComponent } from './Components/MasterSetup/Branch/branch-form/branch-form.component';
import { RegeionFormComponent } from './Components/Regeion/regeion-form/regeion-form.component';
import { RegeionListComponent } from './Components/Regeion/regeion-list/regeion-list.component';
import { DuePaymentListComponent } from './Components/MoneyReceipts/due-payment-list/due-payment-list.component';
import { OrdersListComponent } from './Components/MoneyReceipts/orders-list/orders-list.component';
import { MrFormComponent } from './Components/Orders/mr-form/mr-form.component';
import { DueCustomerListComponent } from './Components/Customer/due-customer-list/due-customer-list.component';
import { DueCustomerFormComponent } from './Components/Customer/due-customer-form/due-customer-form.component';
import { BarcodeGeneratorComponent } from './Components/barcode-generator/barcode-generator.component';
import { BusinessDashboardComponent } from './Components/business-dashboard/business-dashboard.component';
import { AvdsupListComponent } from './Components/Suppliers/avdsup-list/avdsup-list.component';
import { RouterlistComponent } from './Components/mikrotik/routerlist/routerlist.component';
import { pppoeCustomerlistComponent } from './Components/mikrotik/customerlist/pppoecustomerlist.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    ConfigurationComponent,
    NavBarComponent,
    NavigationComponent,
    NavLeftComponent,
    NavRightComponent,
    NavSearchComponent,
    ChatMsgComponent,
    ChatUserListComponent,
    FriendComponent,
    NavContentComponent,
    NavItemComponent,
    NavCollapseComponent,
    NavGroupComponent,
    StoreTypeListComponent,
    StoreTypeFormComponent,
    CommonDataGridComponent,
    CommonDataGridWithCheckBoxComponent,
    ButtonControlComponent,
    SideBarComponent,
    RoleListComponent,
    RoleCreateComponent,
    CategoryFormComponent,
    CategoryListComponent,
    SuppliersListComponent,
    SuppliersFormComponent,
    MenuListComponent,
    MenuFormComponent,
    MenuPermissionFormComponent,
    RegisterLandingComponent,
    RegisterMailVerifyComponent,
    DuePaymentListComponent,
    OrdersListComponent,

    CommonSelectBoxComponent,
    DynamicGridWithPaginationComponent,
    BankFormComponent,
    BankListComponent,
    BmFormComponent,
    BmListComponent,
    PrintLabelListComponent,
    WhFormComponent,
    CatagoryFormComponent,
    CatagoryListComponent,
    // StFormComponent,
    StListComponent,
    UnitFormComponent,
    BrandFormComponent,
    BrandListComponent,
    UnitListComponent,
    // WhFormComponent,
    WhListComponent,
    UserFormComponent,
    UserListComponent,
    ProductsListComponent,
    ProductsFormComponent,
    PurchaseTypeFormComponent,
    PurchaseTypeListComponent,
    PurchaseOrderFormComponent,
    PurchaseOrderListComponent,
    PurformaInvoiceListComponent,
    PurformaInvoiceFormComponent,
    LcRequestFormComponent,
    LcRequestListComponent,
    ShipmentListComponent,
    ShipmentFormComponent,
    GoodsReceivedListComponent,
    GoodsReceivedFormComponent,
    BillEntryListComponent,
    BillEntryFormComponent,
    PaymentVoucherListComponent,
    PaymentVoucherFormComponent,
    OrderListComponent,
    OrderFormComponent,
    PendingorderListComponent,
    DoListComponent,
    DoFormComponent,
    DopendingListComponent,
    IntpendingListComponent,
    InvFormComponent,
    InvListComponent,
    MrFormComponentss,
    MrListComponent,
    MrpendingListComponent,
    CommonAutoCompleteApiComponent,
    CustomerFormComponent,
    CustomerListComponent,
    InvoiceListComponent,
    InvoiceFormComponent,
    PaymentReceiveListComponent,
    PaymentReceiveFormComponent,
    DeliveryOrderListComponent,
    DeliveryOrderFormComponent,
    DeliveryOrderPendingListComponent,
    ProductDiscountListComponent,
    ProductDiscountFormComponent,
    SalesFormComponent,
    ReportViewerComponent,
    BranchListComponent,
    BranchFormComponent,
    RegeionFormComponent,
    RegeionListComponent,
    MrFormComponent,
    DueCustomerListComponent,
    DueCustomerFormComponent,
    BarcodeGeneratorComponent,
    BusinessDashboardComponent,
    AvdsupListComponent,
    RouterlistComponent,
    pppoeCustomerlistComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxDataGridModule,
    DxFormModule,
    DxListModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxTooltipModule,
    DxTreeViewModule,
    DxDateBoxModule,
    DxTagBoxModule,
    DxSchedulerModule,
    DxLoadPanelModule,
    DevExtremeModule,
    DxAccordionModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxContextMenuModule,
    DxDrawerModule,
    DxRadioGroupModule,
    DxTabsModule,
    DxChartModule,
    DxActionSheetModule,
    DxFileUploaderModule,
    DxProgressBarModule,
    DxPopoverModule,
    DxLoadIndicatorModule,
    DxTabPanelModule,
    DxSortableModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    DxReportViewerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe, CookieService
  ],
  bootstrap: [AppComponent],
  exports: [DxReportViewerModule]
})
export class AppModule { }
