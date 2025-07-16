import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed, tick } from '@angular/core/testing';
import { App } from './app';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ModuleRegistry, AllCommunityModule, type GridReadyEvent, type GridApi } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

describe('App', () => {

  ModuleRegistry.registerModules([AllCommunityModule]);

  let httpTesting: HttpTestingController;
  let mockData = [
    { mission: 'Apollo 11', company: 'NASA' },
    { mission: 'Falcon 9', company: 'SpaceX' },
  ];

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

    req.flush(mockData);

    expect(component.data()).toEqual(mockData);
  });

  it('should call setFilterModel on filter', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    const mockApi = jasmine.createSpyObj('GridApi', ['setFilterModel', 'onFilterChanged']);
    const params = { api: mockApi } as unknown as GridReadyEvent;

    component.onGridReady(params);

    const req = httpTesting.expectOne('https://www.ag-grid.com/example-assets/space-mission-data.json');
    req.flush(mockData);

    const filterModel = {
      company: { type: 'equals', filter: 'SpaceX' }
    };

    mockApi.setFilterModel(filterModel);
    mockApi.onFilterChanged();

    expect(mockApi.setFilterModel).toHaveBeenCalledWith(filterModel);
    expect(mockApi.onFilterChanged).toHaveBeenCalled();
  });

  it('should sort data by price ascending', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    const mockApi = jasmine.createSpyObj('GridApi', ['setSortModel']);
    const params = { api: mockApi } as unknown as GridReadyEvent;

    component.onGridReady(params);

    const req = httpTesting.expectOne('https://www.ag-grid.com/example-assets/space-mission-data.json');
    req.flush(mockData);

    const sortModel = [{ colId: 'price', sort: 'asc' }];

    mockApi.setSortModel(sortModel);

    expect(mockApi.setSortModel).toHaveBeenCalledWith(sortModel);
  });

  it('should reset filters and sorting when resetFilterValues is called', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    component.gridApi = jasmine.createSpyObj('GridApi', [
      'setFilterModel',
      'applyColumnState',
      'onFilterChanged'
    ]);

    component.resetFilterValues();

    expect(component.gridApi.setFilterModel).toHaveBeenCalledWith(null);
    expect(component.gridApi.applyColumnState).toHaveBeenCalledWith({ defaultState: { sort: null } });
    expect(component.gridApi.onFilterChanged).toHaveBeenCalled();
  });
});
