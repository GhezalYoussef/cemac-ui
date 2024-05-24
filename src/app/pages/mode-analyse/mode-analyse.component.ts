import { Component } from '@angular/core';
import {TemplateModule} from "@tec/condor/components";
import {PanelModule} from "primeng/panel";
import {InputNumberModule} from "primeng/inputnumber";
import {AutoCompleteModule} from "primeng/autocomplete";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-mode-analyse',
  standalone: true,
  imports: [
    TemplateModule,
    PanelModule,
    InputNumberModule,
    AutoCompleteModule,
    DropdownModule,
    MultiSelectModule,
    ToggleButtonModule,
    ButtonModule
  ],
  templateUrl: './mode-analyse.component.html',
  styleUrl: './mode-analyse.component.scss'
})
export class ModeAnalyseComponent {

}
