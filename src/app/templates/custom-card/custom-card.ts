import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-custom-card',
    imports: [],
    templateUrl: './custom-card.html',
    styleUrl: './custom-card.css'
})
export class CustomCard {

    @Input() data: any;
}
