import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/users';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-user-management', // Selector for using the component in templates.
  templateUrl: './user-management.component.html', // Path to the component's HTML template.
  styleUrls: ['./user-management.component.css'] // Path to the component's CSS styles.
})
export class UserManagementComponent implements OnInit {
  users: User[] = []; // Array to store the list of users.

  // Constructor to inject the UserService.
  constructor(private userService: UserService) { }

  // Initializes the component and loads the list of users.
  ngOnInit(): void {
    this.loadUsers();
  }

  // Loads the list of users from the UserService.
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users; // Assigns the fetched users to the 'users' array.
      },
      (error) => {
        console.error('Error loading users:', error); // Logs an error message if fetching users fails.
      }
    );
  }

  // Handles role changes for a user.
  onRoleChange(user: User): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin'; // Determines the new role based on the current role.
    this.userService.updateUserRole(user._id, newRole).subscribe(
      (updatedUser) => {
        console.log('User role updated successfully:', updatedUser); // Logs a success message.
        // Updates the user's role in the local list.
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      (error) => {
        console.error('Error updating user role:', error); // Logs an error message if updating the role fails.
      }
    );
  }

  // Handles user search.
  searchUser(searchTerm: string): void {
    if (searchTerm.trim()) {
      // Searches for users if the search term is not empty.
      this.userService.searchUsers(searchTerm).subscribe(
        (users: User[]) => {
          this.users = users; // Updates the 'users' array with the search results.
        },
        (error) => {
          console.error('Error searching users:', error); // Logs an error message if the search fails.
        }
      );
    } else {
      // Reloads all users if the search term is empty.
      this.loadUsers();
    }
  }
}
