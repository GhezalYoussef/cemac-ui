import {Component, OnInit} from '@angular/core';
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {MultiSelectModule} from "primeng/multiselect";
import {PanelModule} from "primeng/panel";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TemplateModule} from "@tec/condor/components";
import {ToggleButtonModule} from "primeng/togglebutton";
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
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
import {Requete} from "../../models/requete";
import {catchError, forkJoin, of, switchMap, throwError} from "rxjs";
import {RequeteService} from "../../services/requete.service";
import {NavigationService} from "../../services/navigation.service";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Title} from "@angular/platform-browser";
import {SharedService} from "../../services/shared.service";

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
    MessageModule,
    ToastModule,
    ConfirmDialogModule
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
    familleCatenaireInstallationListFilter : FamilleCatenaire[] = [];
    public requete ?: Requete;

    constructor(
                private titleService: Title,
                private formBuilder: FormBuilder,
                private messageService: MessageService,
                private categorieMaintenanceService: CategorieMaintenanceService,
                private catenaireService: CatenaireService,
                private familleCatenaireService: FamilleCatenaireService,
                private requeteService:RequeteService,
                private sharedService:SharedService,
                private navigationService:NavigationService,
                private confirmationService: ConfirmationService) {

        this.formSaisie = this.formBuilder.group({
            typeLigne:[ELigne.LGV,Validators.required],
            nbrPanto:[1, Validators.required],
            vitesse:[30,Validators.required],
            categorieMaintenance:['',Validators.required],
            typeInstallationTension:['',Validators.required],
            familleInstallationTension:['',Validators.required],
            nombreML:[0,Validators.required],
            nombreIS:[0,Validators.required],
            nombreAIG:[0,Validators.required],
            nombreAT:[0,Validators.required],
            nombreIA:[0,Validators.required]
        });
    }

    ngOnInit(): void {
        this.titleService.setTitle('Mode Saisie');
        this.loadInitialData();
    }

    private loadInitialData(): void {
        this.sharedService.requete$.subscribe(requete => {
            this.requete = requete;
            if (this.requete) {
                this.patchFormValues();
            }

            forkJoin({
                categorieMaintenanceList: this.categorieMaintenanceService.findAll(),
                catenaireList: this.catenaireService.findAll(),
                familleCatenaireList: this.familleCatenaireService.findAll()
            }).subscribe(({ categorieMaintenanceList, catenaireList, familleCatenaireList }) => {
                this.categorieMaintenanceList = categorieMaintenanceList;
                this.catenaireInstallationList = catenaireList;
                this.familleCatenaireInstallationList = familleCatenaireList;
                this.familleCatenaireInstallationListFilter = familleCatenaireList;
                if (this.requete) {
                    this.setCatenaireAndFamilleCatenaire();
                }
            });
        });
    }

    onchange

    private patchFormValues(): void {
        this.formSaisie.patchValue({
            typeLigne: this.requete.typeLigne,
            nbrPanto: this.requete.nbrPanto,
            vitesse: this.requete.vitesse,
            categorieMaintenance: this.requete.categorieMaintenance,
            nombreML: this.requete.nombreML,
            nombreIS: this.requete.nombreIS,
            nombreAIG: this.requete.nombreAIG,
            nombreAT: this.requete.nombreAT,
            nombreIA: this.requete.nombreIA
        });
    }

    private setCatenaireAndFamilleCatenaire(): void {
        const catenaire = this.catenaireInstallationList.find(value => value.id === this.requete.typeInstallationTension);

        if (catenaire) {
            const familleCatenaire = this.familleCatenaireInstallationList.find(value => value.id === catenaire.familleCatenaire);

            if (familleCatenaire) {
                this.formSaisie.get('familleInstallationTension').setValue(familleCatenaire);
                this.catenaireInstallationListFilter = this.catenaireInstallationList.filter(catenaireItem => catenaireItem.familleCatenaire === familleCatenaire.id);
                this.formSaisie.get('typeInstallationTension').setValue(catenaire);
            }
        }
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
                this.f.vitesse.value <= categorieMaintenance.vitesseMax;

            if (isValid) {
                // Créer une clé unique pour chaque categorieMaintenance
                const uniqueKey = `${categorieMaintenance.typeLigne}-${categorieMaintenance.pantoMin}-${categorieMaintenance.pantoMax}-${categorieMaintenance.vitesseMin}-${categorieMaintenance.vitesseMax}`;

                if (!uniqueCategories.has(uniqueKey)) {
                    uniqueCategories.add(uniqueKey);
                    foundCategory = categorieMaintenance.categorieMaintenance;
                    break; // Sortir de la boucle dès qu'une catégorie valide est trouvée
                }
            }
        }

        this.f.categorieMaintenance.setValue(foundCategory);
        this.getFamilleCatenaireByTypeLigne();
    }

    getFamilleCatenaireByTypeLigne(){
        this.familleCatenaireInstallationListFilter =
            this.familleCatenaireInstallationList.filter(value => value.typeLigne === this.f.typeLigne.value);
        this.f.typeInstallationTension.setValue('');
    }

    getCatenaireByFamille() {
        this.catenaireInstallationListFilter =
            this.catenaireInstallationList
                .filter(catenaireList  => catenaireList.familleCatenaire === this.f.familleInstallationTension.value.id);
    }

    onClickSave(analyse:boolean) {
        this.confirmationService.confirm({
            message: `Vous êtes sur le point d'ajouter la requete <br/>Souhaitez-vous confirmer?`,
            header: `Confirmation de l'ajout de la requete`,
            icon: 'pi pi-info-circle',
            accept: () => {
                this.saveRequete(analyse);
            }
        });
    }

    public saveRequete(analyse: boolean) {
        const maDate: Date = new Date();
        const requete = {
            id: this.requete ? this.requete.id : null,
            requeteRef: this.requete ? this.requete.requeteRef : this.formatDate(maDate),
            dateCreation: '',
            createur: '',
            dateModification: '',
            modificateur: '',
            typeLigne:this.f.typeLigne.value,
            nbrPanto:this.f.nbrPanto.value,
            vitesse:this.f.vitesse.value,
            categorieMaintenance:this.f.categorieMaintenance.value,
            typeInstallationTension:this.f.typeInstallationTension.value.id,
            nombreML:this.f.nombreML.value,
            nombreIS:this.f.nombreIS.value,
            nombreAIG:this.f.nombreAIG.value,
            nombreAT:this.f.nombreAT.value,
            nombreIA:this.f.nombreIA.value,
            analyseResultList: []
        };

        this.requeteService.saveRequete(requete).pipe(
            switchMap((res) => {
                return of(res);
            }),
            catchError((error) => {
                // Gérer l'erreur ici
                this.messageService.add({
                    severity: 'error',
                    summary: 'Sauvegarder',
                    detail: `Erreur lors de la sauvegarde de la requête`,
                    key: 'top'
                });
                return throwError(error);
            })
        ).subscribe((res) => {
            // Succès : afficher un message de succès et naviguer vers la liste des requêtes
            this.messageService.add({
                severity: 'success',
                summary: 'Sauvegarder',
                detail: `Requête sauvegardée sous la référence ${requete.requeteRef}`,
                key: 'top'
            });
            if(analyse){
                this.navigationService.navigationToAnalyseRequete(res)
            }else{
                this.navigationService.navigateToListRequetes();
            }
        });
    }

    formatDate(date: Date): string {
        const day: number = date.getDate();
        const month: number = date.getMonth() + 1; // Les mois commencent à 0
        const year: number = date.getFullYear();
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();
        const seconds: number = date.getSeconds();

        // Formatage avec zéro devant les chiffres simples
        const formattedDate = `CEMAC_${year}${this.addLeadingZero(month)}${this.addLeadingZero(day)}${this.addLeadingZero(hours)}${this.addLeadingZero(minutes)}${this.addLeadingZero(seconds)}`;

        return formattedDate;
    }

    addLeadingZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
