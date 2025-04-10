import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import { ActionId } from 'devexpress-reporting/dx-webdocumentviewer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-viewer',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './report-viewer.component.html',
  styleUrls: [
    "../../../../../node_modules/devextreme/dist/css/dx.light.css",
    "../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css",
    "../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css",
    "../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css"
  ]
})
export class ReportViewerComponent implements OnInit {
  @ViewChild(DxReportViewerComponent, { static: false }) viewer!: DxReportViewerComponent;
  invokeAction: string = 'DXXRDV';
  host  : any =environment.reportUrl;
  reportName : any = 'rptSalesInvoice';
  isPrint:boolean =false;


  CustomizeMenuActions(event:any) {
    // Hide the "Print" and "PrintPage" actions. 
    var printAction = event.args.GetById(ActionId.Print);
    if (printAction)
        printAction.visible = false;
    var printPageAction = event.args.GetById(ActionId.PrintPage);
    if (printPageAction)
        printPageAction.visible = false;
}

  constructor(private route:ActivatedRoute) {
 
    this.route.queryParams.subscribe(params => {
      var data = {
        reportName: params['reportName'],
        do: params['do'],
        isPrint: params['isPrint'],
        qty:params['repoQty']
      }
      this.isPrint= data.isPrint;
      this.reportName = JSON.stringify(data);

    });
   }

  ngOnInit(): void {
    if(this.isPrint){
      setTimeout(() => {
        this.viewer.bindingSender.Print(0);
      }, 3000);
    }
  
  }
  print() {
    this.viewer.bindingSender.Print(0);
} 
}
