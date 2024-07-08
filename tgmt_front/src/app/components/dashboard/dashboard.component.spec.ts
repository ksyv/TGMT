import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajout du CUSTOM_ELEMENTS_SCHEMA pour gérer les composants personnalisés
    }).compileComponents();

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockAuthService.getRole.and.returnValue(of('user')); // Exemple de valeur de rôle
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdmin to true if role is admin', () => {
    mockAuthService.getRole.and.returnValue(of('admin'));
    component.ngOnInit();
    expect(component.isAdmin).toBeTrue();
  });

  it('should set isAdmin to false if role is user', () => {
    mockAuthService.getRole.and.returnValue(of('user'));
    component.ngOnInit();
    expect(component.isAdmin).toBeFalse();
  });

  it('should set selectedTab to "mes-informations" by default', () => {
    expect(component.selectedTab).toBe('mes-informations');
  });

  it('should switch tabs correctly', () => {
    component.selectedTab = 'other-tab';
    expect(component.selectedTab).toBe('other-tab');
  });
});
