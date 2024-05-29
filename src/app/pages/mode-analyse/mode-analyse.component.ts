import {Component, OnInit} from '@angular/core';
import {TemplateModule} from "@tec/condor/components";
import {PanelModule} from "primeng/panel";
import {InputNumberModule} from "primeng/inputnumber";
import {AutoCompleteModule} from "primeng/autocomplete";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ButtonModule} from "primeng/button";
import {PaginatorModule} from "primeng/paginator";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {PeriodiciteService} from "../../services/periodicite.service";
import {Periodicite} from "../../models/periodicite.model";
import {NgForOf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";

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
        ButtonModule,
        PaginatorModule,
        ReactiveFormsModule,
        NgForOf,
        InputTextModule
    ],
  templateUrl: './mode-analyse.component.html',
  styleUrl: './mode-analyse.component.scss'
})
export class ModeAnalyseComponent implements OnInit {

  formAnalyse ?: FormGroup;
  periodiciteList : Periodicite[] = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private periodiciteService: PeriodiciteService) {

    this.formAnalyse = this.formBuilder.group({
      analyseArray: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
      this.periodiciteService.findAll().subscribe(
          periodiciteList => {
              const seen = new Set();
              this.periodiciteList = periodiciteList.filter(value => {
                  const key = `${value.libelle}-${value.sousOperation}`;
                  const duplicate = seen.has(key);
                  seen.add(key);
                  return !duplicate;
              });
              const analyseArray = this.formAnalyse.get('analyseArray') as FormArray;
              this.periodiciteList.forEach(
                  periodicite => {
                    analyseArray.push(this.formBuilder.group(
                        {
                          id:[],
                          refResult:[],
                          sousCategorie:[periodicite.sousCategorieOperation],
                          categorie:[periodicite.categorieOperation],
                          operation:[periodicite.libelle],
                          sousOperation:[periodicite.sousOperation],
                          categorieMaintenance:[],
                          nbrUOP:[0],
                          cout:[0]
                        }
                    ))
                  });
          });
  }

    getControls() {
        return (this.formAnalyse.get('analyseArray') as FormArray).controls;
    }

}
