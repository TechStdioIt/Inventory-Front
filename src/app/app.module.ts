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
import { CookieService } from 'ngx-cookie-service';
import { UserListComponent } from './Components/Config/User/user-list/user-list.component';
import { UserFormComponent } from './Components/Config/User/user-form/user-form.component';
import { AuthInterceptor } from './Authorization/AuthInterceptor';
import { DatePipe } from '@angular/common';

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

    CommonSelectBoxComponent,
    DynamicGridWithPaginationComponent,
    BankFormComponent,
    BankListComponent,
    BmFormComponent,
    BmListComponent,
     CatagoryFormComponent,
    CatagoryListComponent,
    // StFormComponent,
    StListComponent,
     UnitFormComponent,
    UnitListComponent,
    // WhFormComponent,
    WhListComponent,
    UserFormComponent,
    UserListComponent

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
  NgMultiSelectDropDownModule.forRoot()
],
  providers: [CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
