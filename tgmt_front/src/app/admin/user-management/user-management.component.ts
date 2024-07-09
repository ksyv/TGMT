import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  onRoleChange(user: User): void {
    // Inverse le rôle de l'utilisateur
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    // Appelez le service pour mettre à jour le rôle de l'utilisateur
    this.userService.updateUserRole(user._id, newRole).subscribe(
      (updatedUser) => {
        console.log('User role updated successfully:', updatedUser);
        // Optionnel : Mettez à jour localement this.users si nécessaire
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      (error) => {
        console.error('Error updating user role:', error);
      }
    );
  }
}
