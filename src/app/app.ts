
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, themeQuartz } from 'ag-grid-community';
import { colorSchemeDark } from 'ag-grid-community';

@Component({
    selector: 'app-root',
    imports: [AgGridAngular],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {

    http    = inject(HttpClient);
    rowData = signal<any[]>([]);
    data    = signal<any[]>([]);
    myTheme = themeQuartz.withPart(colorSchemeDark);
    
    defaultColDef: ColDef = {
        flex: 1,
        filterParams: { applyMiniFilterWhileTyping: true },
        filter: true, 
        floatingFilter: true
    }
    
    gridApi!: GridApi;

    colDefs: ColDef[] = [
        { field: "mission"    },
        { field: "company"    },
        { field: "location"   },
        { field: "date"       },
        { field: "price"      },
        { field: "successful" },
        { field: "rocket"     }
    ];

    constructor(){ }

    onGridReady(params: GridReadyEvent) {

        this.http
            .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
            .subscribe(data => {
                this.gridApi = params.api;
                this.rowData.set(data);
                this.data.set(data);
            });
    }

    resetFilterValues(){

        this.gridApi.setFilterModel(null);
        this.gridApi.applyColumnState( { defaultState: { sort: null }} );
        this.gridApi.onFilterChanged(); 
    }
}
