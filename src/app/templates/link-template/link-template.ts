import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRenderer, ICellRendererParams } from 'ag-grid-enterprise';

@Component({
    selector: 'app-link-template',
    imports: [],
    templateUrl: './link-template.html',
    styleUrl: './link-template.css'
})
export class LinkTemplate implements ICellRendererAngularComp {

    value: any;

    agInit(params: ICellRendererParams<any, any, any>): void {
        this.value = params.value;
    }

    refresh(params: ICellRendererParams<any, any, any>): boolean {
        return false
    }

}
