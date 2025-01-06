import { Component } from '@angular/core';
import { IMSMenu } from 'src/app/Models/IMSMenu';

@Component({
  selector: 'app-menu-form',
 
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss'
})



export class MenuFormComponent {

  submitButtonValue:string='Save';

  FormData: IMSMenu = new IMSMenu();



  onSubmit(data: any) {
    console.warn(data);

  }
  ShowHideEvent() {
    console.log("ShowHideEvent");
  }

}
