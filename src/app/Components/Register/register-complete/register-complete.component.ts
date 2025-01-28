import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-register-complete',
  standalone: true,
  imports: [SharedModule, RouterModule,NgMultiSelectDropDownModule],
  templateUrl: './register-complete.component.html',
  styleUrl: './register-complete.component.scss'
})
export class RegisterCompleteComponent implements OnInit{
  ngOnInit(): void {
   
  }

}
