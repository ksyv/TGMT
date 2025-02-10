import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'; // Importe FormArray
import { OpeningHoursService } from '../../services/opening-hours.service'; // Adapte le chemin
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.css']
})
export class OpeningHoursComponent implements OnInit {
  openingHoursForm: FormGroup;
  daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private openingHoursService: OpeningHoursService,
    private authService: AuthService
    )
    {
    this.openingHoursForm = this.fb.group({
      hours: this.fb.group({ // Groupe pour les horaires de chaque jour
        monday: this.fb.group({ startTime: [''], endTime: [''] }),
        tuesday: this.fb.group({ startTime: [''], endTime: [''] }),
        wednesday: this.fb.group({ startTime: [''], endTime: [''] }),
        thursday: this.fb.group({ startTime: [''], endTime: [''] }),
        friday: this.fb.group({ startTime: [''], endTime: [''] }),
        saturday: this.fb.group({ startTime: [''], endTime: [''] }),
        sunday: this.fb.group({ startTime: [''], endTime: [''] }),
      })
    });
  }

  ngOnInit(): void {
      this.authService.getRole().subscribe(role => {
          this.isAdmin = (role === 'admin');
          if(this.isAdmin){
              this.loadOpeningHours();
          } else {
              this.errorMessage = "Accès interdit: seuls les administrateurs peuvent accéder à cette page."
          }
      });
  }

  loadOpeningHours() {
    console.log("loadOpeningHours called"); // AJOUTE
    this.openingHoursService.getOpeningHours().subscribe({
    next: (data) => {
        console.log("Opening hours data received:", data); // AJOUTE
        // Utilise patchValue pour mettre à jour le formulaire
        this.openingHoursForm.get('hours')?.patchValue(data);
    },
    error: (error) => {
        console.error('Erreur lors de la récupération des horaires:', error);
        this.errorMessage = "Erreur lors de la récupération des horaires.";
    }
    });
}

  onSubmit() {
    if (this.openingHoursForm.valid) {
      this.openingHoursService.updateOpeningHours(this.openingHoursForm.get('hours')?.value).subscribe({ // Envoie hours
        next: () => {
          this.successMessage = 'Horaires mis à jour avec succès.';
          this.errorMessage = null;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des horaires:', error);
          this.errorMessage = 'Erreur lors de la mise à jour des horaires.';
          this.successMessage = null;
        }
      });
    }
  }

    get hours() {
        return this.openingHoursForm.get('hours') as FormGroup;
    }
}
