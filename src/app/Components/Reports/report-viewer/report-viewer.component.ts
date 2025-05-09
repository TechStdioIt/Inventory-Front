import { AfterViewInit, Component,OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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
export class ReportViewerComponent implements OnInit,AfterViewInit  {
  @ViewChild(DxReportViewerComponent, { static: false }) viewer!: DxReportViewerComponent;
  invokeAction: string = 'DXXRDV';
  host  : any =environment.reportUrl;
  reportName : any = 'rptSalesInvoice';
  do: any = 'preview';



  CustomizeMenuActions(event:any) {
    // Hide the "Print" and "PrintPage" actions. 
    var printAction = event.args.GetById(ActionId.Print);
    if (printAction)
        printAction.visible = false;
    var printPageAction = event.args.GetById(ActionId.PrintPage);
    if (printPageAction)
        printPageAction.visible = false;
}

  constructor(private route:ActivatedRoute,private renderer: Renderer2) {
    this.route.queryParams.subscribe(params => {
      var data = {
        reportName: params['reportName'],
        do: params['do']
      }
      this.reportName = JSON.stringify(data);

    });
   }
  ngAfterViewInit(): void {
    const mainContainer = document.querySelector('.pcoded-main-container');
    if (mainContainer) {
      this.renderer.setStyle(mainContainer, 'margin-left', '0px');
    }

    const rightPanel = document.querySelector('.dxrd-designer-wrapper .dxrd-right-panel.dxrd-tab-panel-left');
    if (rightPanel) {
      this.renderer.setStyle(rightPanel, 'width', '380px');
    }

    const content = document.querySelector('.pcoded-content');
    if (content) {
      this.renderer.setStyle(content, 'padding', '0px');
    }
  }

  ngOnInit(): void {
  }

}
