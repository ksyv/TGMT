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
    const updatedUser: User = {
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin' // Inverse le rôle de l'utilisateur
    };

    this.userService.updateUser(updatedUser).subscribe(
      (response) => {
        console.log('User role updated successfully:', response);
      },
      (error) => {
        console.error('Error updating user role:', error);
      }
    );
  }
}
