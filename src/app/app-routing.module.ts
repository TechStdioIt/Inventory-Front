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
        path: 'storetypeList',
        component: StoreTypeListComponent
      },
      {
        path: 'storetypeForm',
        component: StoreTypeFormComponent
      }, {
        path: 'roleForm',
        component: RoleCreateComponent
      },
      {
        path: 'roleList',
        component: RoleListComponent
      }, {
        path: 'categoryList',
        component: CategoryListComponent
      }, {
        path: 'categoryForm',
        component: CategoryFormComponent
      }, {
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
