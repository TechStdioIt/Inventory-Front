import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { DefaultGridButtonShow, GridButtonShow, GridColumn } from './Models/GridModels';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dynamic-grid-with-pagination',
  templateUrl: './dynamic-grid-with-pagination.component.html',
  styleUrls: ['./dynamic-grid-with-pagination.component.scss']
})
export class DynamicGridWithPaginationComponent<T> implements OnInit {
  // @Input() data: T[] = []; // Input for the data to display
  @Input() data: T[] = [];
  @Input() columns: GridColumn<T>[] = []; // Column definitions
  @Input() pageSizes: number[] = [5, 10, 20, 50, 100]; // Configurable page sizes
  @Input() pageSize: number = 5; // Default page size
  @Input() reloadCount: number = 0; // Default page size
  @Input() maxVisiblePages: number = 3; // Maximum visible pages for pagination
  @Input() totalRecords: number = 0; // Maximum visible pages for pagination
  @Input() buttonShow: GridButtonShow<T> = new DefaultGridButtonShow<T>(); // Show buttons based on the configuration\
  @Input() paginationAPI: string = '';
  @Input() haveQueryPram: boolean = false;


  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  startItem: number = 1;
  endItem: number = 1;
  paginatedData: T[] = [];
  pages: (number | string)[] = [];
  sortColumn: keyof T | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredData: T[] = [];
  selectedItems: Set<T> = new Set();
  isAllSelected: boolean = false;

  ngOnInit() {
    if (!this.pageSizes.includes(this.pageSize)) {
      this.pageSizes.push(this.pageSize);
      this.pageSizes.sort((a, b) => a - b); // Optional: Sort the array
    }
    this.pageChangeDynamic();
    this.filteredData = [...this.data];
    this.updatePagination();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadCount'] && !changes['reloadCount'].isFirstChange()) {
      // Trigger reload when API changes
      this.ngOnInit();
    }
  }

  constructor(private dataService: HttpClientConnectionService,private router:Router) {}
  // Handle sorting
  sortTable(column: keyof T) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    this.updatePagination();
  }
  // Handle pagination
  updatePagination() {
    this.totalItems = this.totalRecords;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.startItem + this.pageSize - 1, this.filteredData.length);
    this.paginatedData = this.filteredData;
    this.updatePages();
  }
  // Update page numbers
  updatePages() {
    this.pages = [];
    if (this.totalPages <= this.maxVisiblePages) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      this.pages.push(1);
      if (this.currentPage > 2) this.pages.push('...');
      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = startPage; i <= endPage; i++) this.pages.push(i);
      if (this.currentPage < this.totalPages - 1) this.pages.push('...');
      this.pages.push(this.totalPages);
    }
  }
  pageChangeDynamic() {
    const skip = (this.currentPage - 1) * this.pageSize;
    const take = this.pageSize;
    this.getData({ take: take, skip: skip });
  }
  getData = ({ take, skip }: { take: number; skip: number }) => {
    
    const api = this.haveQueryPram ? `${this.paginationAPI}&take=${take}&skip=${skip}` : `${this.paginationAPI}?take=${take}&skip=${skip}`;
    // Call the API with `take` and `skip` as query parameters
    this.dataService.GetData(api).subscribe(
      (response: any) => {
        debugger;
        // Handle the successful response
        console.log(response);
        if (response) {
          if(response.data){
            this.data = response.data;
            this.totalRecords = response.data[0]?.totalRecords ?? response.data.length;
          }
          else{
            this.data = response;
            this.totalRecords = response[0]?.totalRecords ?? response.length;
          }
          this.filteredData = [...this.data];
          this.updatePagination();
        } else {
          this.data = []; // Fallback in case of empty response
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Failed to get data:', error);
        if(error.error.message == 'You are not authorized! Please log in to access this resource.'){
          this.router.navigate(['/']);
        }
      }
    );
    
  };
  // Navigate to a specific page
  goToPage(page: any) {
    if (page !== '...') {
      this.currentPage = page;
      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  changePageSize(evt: any) {
    this.pageSize = evt.target.value;
    this.pageChangeDynamic();
  }
  // Navigate to the next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChangeDynamic();
      // this.updatePagination();
    }
  }
  // Search functionality
  onSearch(evnt: any) {
    const searchTerm = evnt.target.value.trim();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filter data based on the search term
    this.filteredData = this.data.filter((item) =>
      this.columns.some((column) => {
        if (column.isShow !== false) {
          // Only search visible columns
          const value = item[column.key];
          return value !== null && value !== undefined && String(value).toLowerCase().includes(lowerCaseSearchTerm);
        }
        return false;
      })
    );
    // Reset to the first page after filtering
    this.currentPage = 1;
    this.updatePagination();
  }
  // Toggle selection of all items
  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      // Add all currently paginated items to the selected set
      this.paginatedData.forEach((item) => this.selectedItems.add(item));
    } else {
      // Remove all currently paginated items from the selected set
      this.paginatedData.forEach((item) => this.selectedItems.delete(item));
    }
  }
  // Toggle selection of an individual item
  toggleUserSelection(item: T) {
    if (this.selectedItems.has(item)) {
      // If the item is already selected, remove it
      this.selectedItems.delete(item);
    } else {
      // Otherwise, add it to the selected set
      this.selectedItems.add(item);
    }
    // Update the "Select All" checkbox state
    this.isAllSelected = this.paginatedData.every((item) => this.selectedItems.has(item));
  }
}
