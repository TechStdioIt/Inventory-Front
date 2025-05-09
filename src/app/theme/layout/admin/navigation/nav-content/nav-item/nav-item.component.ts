// Angular Import
import { AfterViewInit, Component, Input } from '@angular/core';

// project import
import { NavigationItem } from '../../navigation';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/Services/common.service';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements AfterViewInit {
  constructor(private gridService:GridHandlerService,private router:Router,private commonService:CommonService){
   
  }
  ngAfterViewInit(): void {
    var json = JSON.stringify(this.item);
    this.menuPermissionData= this.commonService.encrypt(json,'menuPermissionData');
  }
  // public props
  @Input() item!: NavigationItem;
  menuPermissionData:any =''
  // public method
  closeOtherMenu(event: MouseEvent) {
    const ele = event.target as HTMLElement;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement as HTMLElement;
      const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.pcoded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('pcoded-trigger');
      }

      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
    if (document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
    }
  }
  onRouting(uri:any,item:any){
    
    if(uri == '/orderPlist' || uri == '/deliveryOrderPList' || uri == '/invPList' || uri == '/mrPList'){
      this.gridService.selectedTab = 'PList'
    }else{
      this.gridService.selectedTab = 'List';
    }
     this.router.navigate([uri],{queryParams:{id:this.menuPermissionData}});
   
  }
getLink(uri: string) {
    const data = this.getParams(uri);
    return data.path;
  }
  getParams(url: string) {
    const [path, queryString] = url.split('?');
    const params = new URLSearchParams(queryString);
    const paramObj: any = {};
    
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
  
    return { path, params: paramObj };
  }
  getParamsObj(uri: string) {
    const data = this.getParams(uri);
    return data.params;
  }
}
