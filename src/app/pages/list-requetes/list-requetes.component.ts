import { Component } from '@angular/core';
import {TemplateModule} from "@tec/condor/components";

@Component({
  selector: 'app-list-requetes',
  standalone: true,
  imports: [
    TemplateModule
  ],
  templateUrl: './list-requetes.component.html',
  styleUrl: './list-requetes.component.scss'
})
export class ListRequetesComponent {

}
