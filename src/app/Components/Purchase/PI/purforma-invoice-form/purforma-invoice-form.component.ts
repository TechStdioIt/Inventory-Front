import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purforma-invoice-form',
  templateUrl: './purforma-invoice-form.component.html',
  styleUrl: './purforma-invoice-form.component.scss'
})
export class PurformaInvoiceFormComponent {

}
