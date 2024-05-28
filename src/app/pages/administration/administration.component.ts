import { Component } from '@angular/core';
import {TemplateModule} from "@tec/condor/components";

@Component({
  selector: 'app-administration',
  standalone: true,
    imports: [
        TemplateModule
    ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent {

}
