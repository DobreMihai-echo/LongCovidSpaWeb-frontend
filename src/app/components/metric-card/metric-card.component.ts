import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.css']
})
export class MetricCardComponent {
  @Input() title: string = 'Title';
  @Input() value: number = 0;
  @Input() chart: number = 1; // Default type is 'type1'

  getCardClass() {
    switch (this.chart) {
      case 1:
        return 'first-card';
      case 2:
        return 'second-card';
      case 3:
        return 'third-card';
      case 4:
        return 'fourth-card';
      default:
        return '';
    }
  }
}
