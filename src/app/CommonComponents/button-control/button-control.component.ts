import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DxTabsComponent } from 'devextreme-angular';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-button-control',
  templateUrl: './button-control.component.html',
  styleUrls: ['./button-control.component.css']
})
export class ButtonControlComponent implements OnInit {

  @Input() isAdd:boolean=true;
  @Input() isEdit:boolean=true;
  @Input() isDelete:boolean=true;
  @Input() isDetails:boolean=true;
  SelectedMenuItems : any ;
  idsValue:string ='';
  @ViewChild('withText') withText!: DxTabsComponent;

  @ViewChild('withIconAndText') withIconAndText!: DxTabsComponent;

  @ViewChild('withIcon') withIcon!: DxTabsComponent;

  tabsWithText: any[] = [];

  tabsWithIconAndText: any[] = [];

  tabsWithIcon: any[] = [];

  orientations: string[] = ['horizontal', 'vertical'];

  stylingModes: string[] = ['primary', 'secondary'];

  iconPositions: string[] = ['top', 'start', 'end', 'bottom'];

  width = '100%';

  orientation: string = 'horizontal';

  stylingMode: string = 'primary';

  iconPosition: string = 'top';

  showNavButtons = false;

  scrollByContent = false;

  rtlEnabled = false;

  shouldRestrictWidth = true;

  widgetWrapperClasses = {
    'widget-wrapper': false,
    'widget-wrapper-horizontal': true,
    'widget-wrapper-vertical': false,
    'strict-width': false,
    'width': '100%'
  };

  currentRoute:string ='';
  constructor(private dataService: HttpClientConnectionService, private router: Router, public gridHandlerService: GridHandlerService,private activatedRoute: ActivatedRoute,private commonService:CommonService ) {
      this.currentRoute = this.router.url;
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.currentRoute = event.url;
            if(this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList'){
              this.gridHandlerService.selectedTab = 'PList'
            }
            else if(this.currentRoute.endsWith('List')){
              this.gridHandlerService.selectedTab = "List";
            }
          }
        });
        this.activatedRoute.queryParams.subscribe(params => {
          this.idsValue= params['id'];
          var data = this.commonService.decrypt(this.idsValue,"menuPermissionData");
          this.SelectedMenuItems = JSON.parse(data);
        });
        
  }
  ngOnInit(): void {
    
    if(this.currentRoute == '/orderPList' || this.currentRoute == '/deliveryOrderPList'){
      this.gridHandlerService.selectedTab = 'PList'
    }
  }
 


  selectTab(tab: string): void {
    if (tab == 'Save' || tab == 'Delete' ){
      if (tab == 'Save') {
        this.gridHandlerService.addNew();

      }else {
        if (this.gridHandlerService.checkBoxSelectedData.length > 0) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete selected record',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
          }).then((result) => {
            if (result.value) {
              this.gridHandlerService.delete();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled',
                'Your record is safe :)',
                'error'
              )
              this.gridHandlerService.checkBoxSelectedData = [];
            }
          })
        }
        else{
          Swal.fire({
            icon: 'warning',
            title: 'Please select record to delete',
            showConfirmButton: false,
            timer: 1500 // auto close after 1.5 seconds
          });
        }
        // if (this.gridHandlerService.checkBoxSelectedData.length > 0) {
        //   if (confirm("Are you sure to delete selected record(s)?") == true) {
        //     this.gridHandlerService.delete();
        //   }

        // } else {
        //   alert("Please select record to delete");
        // }
      }

    } else if(tab =='Details'){
      alert("Please go to List then Select a Record");
    }else if(tab == 'Approve'){
      this.gridHandlerService.approve();
    }
    else {
      const fullUrl = this.router.url.split('?')[0]; 
      const routeSegment = fullUrl.split('/')[1];
      var minorTab='';
      minorTab = routeSegment.includes("PList") ? 'PList' : routeSegment.includes("Form") ? 'Form' : routeSegment.includes("List") ? 'List' : 'PList';
      // if(tab =="List"){
      //   minorTab='Form';
      // }else{
      //   minorTab='List'
      // }
     var redirectRoute= routeSegment.replace(minorTab, tab);
      this.router.navigate(['/'+ redirectRoute],{queryParams:{id:this.idsValue}});
    }
    if(tab !== 'Approve'){
      this.gridHandlerService.selectedTab = tab;
    }

  }


}
