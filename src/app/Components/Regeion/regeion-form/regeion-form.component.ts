import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, flatMap, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Doctor, DoctorBrand, DoctorChamber, DoctorDegree, DoctorSpecialDay, DoctorSpeciality } from 'src/app/Models/Doctor';
import { CommonService } from 'src/app/Services/common.service';
import { Regeion } from 'src/app/Models/Regeion';
@Component({
  selector: 'app-regeion-form',
  templateUrl: './regeion-form.component.html',
  styleUrl: './regeion-form.component.scss'
})
export class RegeionFormComponent implements OnInit, OnDestroy {
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new Regeion();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'District Form';
  insertOrUpdateAPI: string = 'Unit/CreateOrUpdateRegeion';
  getDataByIdAPI: string = 'Unit/GetAllSubAreaById';
  listRoute: string = '/RegeionList';
  selectedItems: any[] = [];

  //Only for Pharmacy
  businessOptions = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' }
  ];

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {};

    return modelMapping[modelName] || Object;
  }

  formdata: any[] = [
    
    {
      type: 'select',
      name: 'divisionId',
      label: 'Select Division',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 14
    },
    {
      type: 'select',
      name: 'districtId',
      label: 'Select District',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      // isApi: true,
      // api: 'Unit/GetAll'
    },

    {
      type: 'select',
      name: 'upazilaId',
      label: 'Select Upazila',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
    },
    { type: 'text', name: 'name', label: 'SubArea Name', required: true, column: 6 },
  ];

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    private location: Location,
    public gridHandleService: GridHandlerService,
    private commonService: CommonService
  ) {
    this.router.queryParams.subscribe((data: any) => {
      if (data.do != undefined && data != null) {
        this.getDataById(data.do);
      } else {
        this.FormData = new Doctor();
      }
    });
    this.gridHandleService.add$
    .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when component is destroyed
    .subscribe(async (data: NgForm) => {
      if (!this.isSubmitting) { // Prevent multiple submissions
        this.isSubmitting = true;

        try {
          await this.onSubmit(data); // Your form submission logic
          this.gridHandleService.selectedTab = "List";
        } catch (error) {
          console.error('Error during submission:', error);
        } finally {
          this.isSubmitting = false; // Reset flag after completion
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.formdata
      .filter((x) => x.type == 'select' || x.type == 'multi-select')
      .forEach((item: any) => {
        if (item.flag) {
          this.commonService.getDropDownData(item.flag).subscribe((data: any) => {
            item.options = data;
          });
        }
        else if (item.isApi) {
          this.dataService.GetData(item.api).subscribe((data: any) => {
            item.options = data.data;
          });
        }
      });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id: any) {
    this.dataService.GetData(`${this.getDataByIdAPI}?id=` + id).subscribe((data: any) => {
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Doctor;
    });
  }
  insertOrUpdate(form: NgForm) {
    
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
        this.FormData = new Doctor();
        this.route.navigate([this.listRoute]);
        this.gridHandleService.selectedTab = 'List';
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }
  handleEvent(functionName: string, event: any, fieldName?: string, optionModel?: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event, fieldName, optionModel); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
  onItemSelect(item: any, fieldName: string, optionModel: any) {
    if (!this.FormData[fieldName]) {
      this.FormData[fieldName] = [];
    }
    this.selectedItems.push(item.id);
    let ModelClass = this.getModelClass(optionModel.model);
    let newEntry = new ModelClass();
    newEntry[optionModel.optionValue] = item.id;
    this.FormData[fieldName].push(newEntry);
  }
  // Triggered when an item is unselected
  onItemDeSelect(item: any, fieldName: string) {
    var exist = this.selectedItems.find((x: number) => x === item.id);
    var foundItem = this.FormData[fieldName]?.find((x: any) => x.specialityId === item.id);

    if (foundItem) {
      const index = this.FormData[fieldName].indexOf(foundItem);
      if (index !== -1) {
        this.FormData[fieldName].splice(index, 1);
      }
    }
    if (exist) {
      const selectedIndex = this.selectedItems.indexOf(exist);
      if (selectedIndex !== -1) {
        this.selectedItems.splice(selectedIndex, 1);
      }
    }
  }
  // Triggered when all items are selected
  onSelectAll(items: any, fieldName: string, optionModel: any) {
    if (!this.FormData[fieldName]) {
      this.FormData[fieldName] = [];
    }
    let ModelClass = this.getModelClass(optionModel.model);
    items.forEach((item: any) => {
      this.selectedItems.push(item.id);

      let newEntry = new ModelClass();
      newEntry[optionModel.optionValue] = item.id;

      this.FormData[fieldName].push(newEntry);
    });
  }
  // Triggered when all items are unselected
  onDeSelectAll(items: any, fieldName: string) {
    this.selectedItems = [];
    this.FormData[fieldName] = [];
  }
  onValueReceived(eventData: { value: any; fieldName?: any }) {
    this.FormData[eventData.fieldName] = eventData.value;

    let flagdata = [
      { api: 'Unit/GetAllSubAreaByDivisionId?divisionId=', fieldName: 'divisionId', for: 'districtId' },
      { api: 'Unit/GetAllSubAreaByDistrictId?districtId=', fieldName: 'districtId', for: 'upazilaId' },
    ];

    flagdata.filter((x) => x.fieldName === eventData.fieldName).forEach((item) => {
      this.dataService.GetData(item.api + eventData.value).subscribe((data: any) => {
        this.formdata.find((x) => x.name == item.for).options = data.data;
      });
    });

  }
}
