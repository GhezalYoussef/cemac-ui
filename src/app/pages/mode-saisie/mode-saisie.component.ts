import { Component } from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {MultiSelectModule} from "primeng/multiselect";
import {PanelModule} from "primeng/panel";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TemplateModule} from "@tec/condor/components";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ELigne} from "../../models/enum/ELigne.enum";
import {InputTextModule} from "primeng/inputtext";
import {ETension} from "../../models/enum/ETension.enum";

@Component({
  selector: 'app-mode-saisie',
  standalone: true,
    imports: [
        AutoCompleteModule,
        ButtonModule,
        DropdownModule,
        InputNumberModule,
        MultiSelectModule,
        PanelModule,
        SharedModule,
        TemplateModule,
        ToggleButtonModule,
        ReactiveFormsModule,
        InputTextModule
    ],
  templateUrl: './mode-saisie.component.html',
  styleUrl: './mode-saisie.component.scss'
})
export class ModeSaisieComponent {

    formSaisie ?: FormGroup;
    typeLigneList : string[] = [ELigne.CLASSIQUE, ELigne.LGV];
    typeInstallationTensionList : string[] = [ETension.ALL, ETension._1500, ETension._25000]

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private messageService: MessageService) {

        this.formSaisie = this.formBuilder.group({
            typeLigne:[],
            nbrPantoMin:[],
            nbrPantoMax:[],
            vitesseMin:[],
            vitesseMax:[],
            categorieMaintenance:[],
            typeInstallationTension:[],
            nombreML:[],
            nombreIS:[],
            nombreAIG:[],
            nombreAT:[],
            nombreIA:[]
        });
    }

}
