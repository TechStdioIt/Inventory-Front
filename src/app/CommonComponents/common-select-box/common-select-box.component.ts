import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimplifiedSearchMode } from 'devextreme/common';

@Component({
  selector: 'app-common-select-box',
  // standalone: true,
  // imports: [],
  templateUrl: './common-select-box.component.html',
  styleUrl: './common-select-box.component.scss'
})
export class CommonSelectBoxComponent implements OnInit {
  @Input() dataList: any[] = [];
  @Input() selectedValue: any;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() searchExprOption: string[] = [];
  @Input() error: boolean = false;
  @Input() searchTimeoutOption: number = 200;
  @Input() minSearchLengthOption: number = 0;
  @Input() searchModeOption: SimplifiedSearchMode  = 'contains'; // contains, startswith, endswith
  @Input() showDataBeforeSearchOption: boolean = true; // auto, always, never
  @Output() valueChange = new EventEmitter<any>();

  ngOnInit(): void {
   
  }
  onValueChanged(event: any): void {
    if (this.valueChange.observed) {
      this.valueChange.emit(event.value);
    }
  }


  
}
