// Angular Import
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit{
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
loggedUserInfo :any;
  // constructor
  constructor(private dataService:HttpClientConnectionService,private router:Router) {
    this.visibleUserList = false;
    this.chatMessage = false;
  }
  ngOnInit(): void {
   this.getLoggedUserInfo();
  }
  getLoggedUserInfo(){
    var id =localStorage.getItem('userId');
    if(id){
      this.dataService.GetData('Administrator/GetUserById?id='+id).subscribe((data:any)=>{
        ;
        this.loggedUserInfo = data.data
      })
    }else{
      this.router.navigate(['/'])
    }
  
  }
  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
  
}
