import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimplifiedSearchMode } from 'devextreme/common';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-common-select-box',
  // standalone: true,
  // imports: [],
  templateUrl: './common-select-box.component.html',
  styleUrl: './common-select-box.component.scss'
})
export class CommonSelectBoxComponent implements OnInit {
  @Input() dataList: any = [];
  @Input() selectedValue: any;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() name: string = 'name';
  @Input() id: string = 'id';
  @Input() fieldName: string = '';
  @Input() searchExprOption: string[] = [];
  @Input() error: boolean = false;
  @Input() searchTimeoutOption: number = 200;
  @Input() minSearchLengthOption: number = 0;
  @Input() searchModeOption: SimplifiedSearchMode  = 'contains'; // contains, startswith, endswith
  @Input() showDataBeforeSearchOption: boolean = true; // auto, always, never
  @Input() isApiCall: boolean = false;
  @Input() apiUrl: string = '';
  @Input() flag: string = '';
  @Output() valueChange = new EventEmitter<any>();
  @Input() isReadOnly:boolean=false;

  searchTimeout: any;

constructor(private dataService:HttpClientConnectionService) { }
  ngOnInit(): void {
   
  }
  // onValueChanged(event: any,optionModel?:any): void {
  //   if (this.valueChange.observed) {
  //     this.valueChange.emit(event.value);
  //   }
  // }
  onValueChanged(event: any): void {
    
    if (this.valueChange.observed) {
      if(this.fieldName !='' && this.fieldName !="" && this.fieldName != null)
      {
        this.valueChange.emit({ value: event.value, fieldName: this.fieldName });
        }
      else{
        this.valueChange.emit(event.value);
      }
    }
  }

  onSearch(event: any) {
    

    if(!this.isApiCall){
      return;
    }
    const searchTerm = event.component.option('text');
    if (searchTerm.length < 3) {
      return; // Do nothing if less than 3 characters
    }

    clearTimeout(this.searchTimeout); // Clear previous timeout to avoid multiple calls

    this.searchTimeout = setTimeout(() => {
      this.fetchData(searchTerm,event);
    }, 300); // Debounce API call (waits 300ms after user stops typing)
  }

  fetchData(searchTerm: string,event: any) {
    
    let url = this.makeApiUrl(searchTerm);
    this.dataService.GetData(url).subscribe(

      (response:any) => {
        // this.dataList = response; // Update select box data
        if (Array.isArray(response)) {
          this.dataList = [...response]; // Append new data
          // Preserve search text after updating data source
        setTimeout(() => {
          event.component.option('text', searchTerm);
        }, 10);
          // this.dataList = response; // Append new data
          
        } else {
          console.error('API response is not an array:', response);
        }

      },
      (error:any) => {
        console.error('Error fetching data:', error);
      });
    
  }

  makeApiUrl(searchTerm: string) {
    // GetDropDownBySearchString?flag=1&searchText=st
    let url = `Administrator/GetDropDownBySearchString?flag=${this.flag}&searchText=${searchTerm}`;
    return url;
  }


  
}
