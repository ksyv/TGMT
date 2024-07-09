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
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.userService.updateUserRole(user._id, newRole).subscribe(
      (updatedUser) => {
        console.log('User role updated successfully:', updatedUser);
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

  // Méthode pour la recherche d'utilisateur
  searchUser(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.userService.searchUsers(searchTerm).subscribe(
        (users: User[]) => {
          this.users = users;
        },
        (error) => {
          console.error('Error searching users:', error);
        }
      );
    } else {
      // Recharge tous les utilisateurs si le champ de recherche est vide
      this.loadUsers();
    }
  }
}
