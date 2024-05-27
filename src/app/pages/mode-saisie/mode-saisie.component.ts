import {Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {MultiSelectModule} from "primeng/multiselect";
import {PanelModule} from "primeng/panel";
import {MessageService, SharedModule} from "primeng/api";
import {TemplateModule} from "@tec/condor/components";
import {ToggleButtonModule} from "primeng/togglebutton";
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ELigne} from "../../models/enum/ELigne.enum";
import {InputTextModule} from "primeng/inputtext";
import {CategorieMaintenance} from "../../models/categorie-maintenance.model";
import {CategorieMaintenanceService} from "../../services/categorie-maintenance.service";
import {StyleClassModule} from "primeng/styleclass";
import {MessageModule} from "primeng/message";
import {Catenaire} from "../../models/catenaire.model";
import {CatenaireService} from "../../services/catenaire.service";
import {FamilleCatenaireService} from "../../services/famille-catenaire.service";
import {FamilleCatenaire} from "../../models/famille-catenaire.model";

@Component({
  selector: 'app-mode-saisie',
  standalone: true,
    imports: [
        CommonModule,
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
        InputTextModule,
        StyleClassModule,
        MessageModule
    ],
  templateUrl: './mode-saisie.component.html',
  styleUrl: './mode-saisie.component.scss'
})
export class ModeSaisieComponent implements OnInit {

    formSaisie ?: FormGroup;
    typeLigneList : string[] = [ELigne.CLASSIQUE, ELigne.LGV];
    categorieMaintenanceList : CategorieMaintenance[] = [];
    catenaireInstallationList : Catenaire[] = [];
    familleCatenaireInstallationList : FamilleCatenaire[] = [];
    catenaireInstallationListFilter : Catenaire[] = [];

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private messageService: MessageService,
                private categorieMaintenanceService: CategorieMaintenanceService,
                private catenaireService: CatenaireService,
                private familleCatenaireService: FamilleCatenaireService) {

        this.formSaisie = this.formBuilder.group({
            typeLigne:['',Validators.required],
            nbrPanto:[0, Validators.required],
            vitesse:[0,Validators.required],
            categorieMaintenance:['',Validators.required],
            typeInstallationTension:['',Validators.required],
            FamilleInstallationTension:['',Validators.required],
            nombreML:[0,Validators.required],
            nombreIS:[0,Validators.required],
            nombreAIG:[0,Validators.required],
            nombreAT:[0,Validators.required],
            nombreIA:[0,Validators.required]
        });
    }



    ngOnInit() {
        this.categorieMaintenanceService.findAll().subscribe(
            categorieMaintenanceList => {
                this.categorieMaintenanceList = categorieMaintenanceList;
            });

        this.catenaireService.findAll().subscribe(
            catenaireList => {
                this.catenaireInstallationList = catenaireList;
            });

        this.familleCatenaireService.findAll().subscribe(
            familleCatenaireList => {
                this.familleCatenaireInstallationList = familleCatenaireList;
            });
    }

    get f() { return this.formSaisie.controls; }

    getCategorieMaintenance() {
        const uniqueCategories = new Set();
        let foundCategory = '';

        for (const categorieMaintenance of this.categorieMaintenanceList) {
            const isValid = this.f.typeLigne.value === categorieMaintenance.typeLigne &&
                this.f.nbrPanto.value >= categorieMaintenance.pantoMin &&
                this.f.nbrPanto.value < categorieMaintenance.pantoMax &&
                this.f.vitesse.value > categorieMaintenance.vitesseMin &&
                this.f.vitesse.value <= categorieMaintenance.viteeseMax;

            if (isValid) {
                // Créer une clé unique pour chaque categorieMaintenance
                const uniqueKey = `${categorieMaintenance.typeLigne}-${categorieMaintenance.pantoMin}-${categorieMaintenance.pantoMax}-${categorieMaintenance.vitesseMin}-${categorieMaintenance.viteeseMax}`;

                if (!uniqueCategories.has(uniqueKey)) {
                    uniqueCategories.add(uniqueKey);
                    foundCategory = categorieMaintenance.categorie;
                    break; // Sortir de la boucle dès qu'une catégorie valide est trouvée
                }
            }
        }

        this.f.categorieMaintenance.setValue(foundCategory);
    }

    getCatenaireByFamille() {
        this.catenaireInstallationListFilter = this.catenaireInstallationList.filter(
            catenaireList  => catenaireList.familleCatenaire === this.f.FamilleInstallationTension.value.id);
    }



}
