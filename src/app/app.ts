import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, themeQuartz, SideBarDef } from 'ag-grid-community';
import { colorSchemeDark } from 'ag-grid-community';
import { LinkTemplate } from './templates/link-template/link-template';
import { CustomCard } from "./templates/custom-card/custom-card";

@Component({
    selector: 'app-root',
    imports: [AgGridAngular, CustomCard],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {

    http      = inject(HttpClient);
    rowData   = signal<any[]>([]);
    data      = signal<any[]>([]);
    theme     = themeQuartz.withPart(colorSchemeDark);

    customTheme = themeQuartz.withParams({
        backgroundColor:               'rgb(249, 245, 227)',
        foregroundColor:               'rgb(126, 46, 132)',
        headerTextColor:               'rgb(204, 245, 172)',
        headerBackgroundColor:         'rgb(209, 64, 129)',
        oddRowBackgroundColor:         'rgb(0, 0, 0, 0.03)',
        headerColumnResizeHandleColor: 'rgb(126, 46, 132)',
    });
    
    defaultColDef: ColDef = {
        flex:           1,
        filterParams:   { applyMiniFilterWhileTyping: true },
        filter:         true, 
        floatingFilter: true
    }

    sideBar: SideBarDef = {
        toolPanels: [
            'columns', 
            'filters',
            // {
            //     id: 'customComponent',
            //     labelDefault: 'Custom Component',
            //     labelKey: 'customComponent',
            //     iconKey: 'home',
            //     toolPanel: App
            // }
        ],
        //defaultToolPanel: 'customComponent'
    }
    
    gridApi!: GridApi;

    colDefs: ColDef[] = [
        { field: "mission"    , cellRenderer: (input: any) => `# ${input.value}`},
        { field: "company"    , 
            cellRenderer: LinkTemplate,
            // Add custom Value Element and Input to custom Component
            // cellRendererParams: { 
            //     customName: 'valueName'
            // }
        },
        { field: "location"   },
        { field: "date"       },
        { field: "price"      },
        { field: "successful" },
        { field: "rocket"     }
    ];

    displayedRows: any[] = [];

    constructor(){ }

    onGridReady(params: GridReadyEvent) {

        this.http
            .get<any[]>('https://www.ag-grid.com/example-assets/space-mission-data.json')
            .subscribe(data => {
                this.gridApi = params.api;
                this.rowData.set(data);
                this.data.set(data);
                this.displayedRows = data;
            });
    }

    resetFilterValues(){

        this.gridApi.setFilterModel(null);
        this.gridApi.applyColumnState( { defaultState: { sort: null }} );
        this.gridApi.onFilterChanged(); 
    }

    // Method to use Cards with Filters
    updateDisplayedRows() {
        this.displayedRows = [];
        this.gridApi.forEachNodeAfterFilterAndSort(node => {
        this.displayedRows.push(node.data);
    });
  }
}
