import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, tick } from '@angular/core/testing';
import { App } from './app';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ModuleRegistry, AllCommunityModule, type GridReadyEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

describe('App', () => {

  let httpTesting: HttpTestingController;

  ModuleRegistry.registerModules([AllCommunityModule]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(), // ✅ required in Angular 20
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('load data', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    const mockApi = { setFilterModel: jasmine.createSpy() } as any;
    const event = { api: mockApi } as GridReadyEvent;

    component.onGridReady(event); 

    const req = httpTesting.expectOne('https://www.ag-grid.com/example-assets/space-mission-data.json');
    
    expect(req.request.method).toBe('GET');

    const mockData = [
      { mission: 'Apollo 11', company: 'NASA' },
      { mission: 'Falcon 9', company: 'SpaceX' },
    ];

    req.flush(mockData);

    expect(component.data()).toEqual(mockData);
  });
});
