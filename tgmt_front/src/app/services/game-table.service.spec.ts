import { TestBed } from '@angular/core/testing';

import { GameTableService } from './game-table.service';

describe('GameTableService', () => {
  let service: GameTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
