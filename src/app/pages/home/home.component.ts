import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CdSillonComponent, TemplateModule } from '@tec/condor/components';

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  styles: [`
  .cd-sillon {
    margin: 0 !important;
    padding: 0 !important;
  }
  .cd-sillon .cd-sillon-title {
    font-size: 3rem !important;
  }
  .uppercase {
    text-transform: uppercase;
  }
  `],
  imports: [CommonModule, CdSillonComponent, TemplateModule, FontAwesomeModule],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  faCheck = faCheck;
}
