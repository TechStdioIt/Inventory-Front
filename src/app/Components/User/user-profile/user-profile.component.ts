import { Component, OnInit } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: any; // Replace 'any' with your user model type
  isLoading: boolean = true;


  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  errorMessage: string = '';
  successMessage: string = '';
  constructor(private dataService:HttpClientConnectionService) {
  }
      
  ngOnInit(): void {
  throw new Error('Method not implemented.');
}


updatePassword(form: any) {
  debugger;
    this.errorMessage = '';
    this.successMessage = '';

    const { newPassword, confirmPassword } = this.passwordData;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New password and confirmation do not match.';
      return;
    }


    this.dataService.PostData('Administrator/ChangePassword', this.passwordData).subscribe({
  next: (response: any) => {
    this.successMessage = '✅ Password updated successfully!';
    form.resetForm();
  },
  error: (error: any) => {
    this.errorMessage = '❌ Failed to update password. Please try again.';
    console.error('Error updating password:', error);
  }
});

    

}
}

