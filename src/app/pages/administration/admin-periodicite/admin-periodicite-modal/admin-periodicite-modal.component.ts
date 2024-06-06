import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {Periodicite} from "../../../../models/periodicite.model";
import {Catenaire} from "../../../../models/catenaire.model";
import {CatenaireService} from "../../../../services/catenaire.service";
import {PeriodiciteService} from "../../../../services/periodicite.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-admin-periodicite-modal',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DropdownModule,
    InputTextModule,
    MessageModule,
    PaginatorModule,
    PanelModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './admin-periodicite-modal.component.html',
  styleUrl: './admin-periodicite-modal.component.scss'
})
export class AdminPeriodiciteModalComponent implements OnInit {

  formPeriodicite ?: FormGroup;
  catenaireList: Catenaire[] = [];
  periodicite ?: Periodicite;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private messageService: MessageService,
              private periodiciteService: PeriodiciteService,
              private catenaireService: CatenaireService,
  ) {
      this.periodicite = this.dialogConfig.data.periodicite;
      this.formPeriodicite = this.formBuilder.group({
        catenaires: ['', Validators.required],
        categorieOperation:['', Validators.required],
        sousCategorieOperation:['', Validators.required],
        libelle:['', Validators.required],
        sousOperation:['', Validators.required],
        typeLigne:['', Validators.required],
        tension:['', Validators.required],
        categorieMaintenance:['', Validators.required],
        unit:['', Validators.required],
        periode:['', Validators.required],
      });
  }

  get f() {
    return this.formPeriodicite.controls;
  }

  ngOnInit(): void {
    if (this.periodicite !== undefined) {
      this.f.catenaires.setValue(this.periodicite.catenaires);
      this.f.categorieOperation.setValue(this.periodicite.categorieOperation);
      this.f.sousCategorieOperation.setValue(this.periodicite.sousCategorieOperation);
      this.f.sousOperation.setValue(this.periodicite.sousOperation);
      this.f.typeLigne.setValue(this.periodicite.typeLigne);
      this.f.tension.setValue(this.periodicite.tension);
      this.f.categorieMaintenance.setValue(this.periodicite.categorieMaintenance);
      this.f.unit.setValue(this.periodicite.unit);
      this.f.periode.setValue(this.periodicite.periode);
    }
    this.getCatenaireList();
  }

  getCatenaireList() {
    this.catenaireService.findAll().subscribe(
        res => {
          this.catenaireList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'warn',
                summary: 'Charger',
                detail: 'Erreur lors du chargement de la',
                key: 'top'
              });
        })
  }

  addPeriodicite() {
    const periodicite: Periodicite = {
      id: this.periodicite !== undefined ? this.periodicite.id : null,
      catenaires: this.f.catenaires.value,
      categorieOperation:this.f.categorieOperation.value,
      sousCategorieOperation:this.f.sousCategorieOperation.value,
      libelle:this.f.libelle.value,
      sousOperation:this.f.sousOperation.value,
      typeLigne:this.f.typeLigne.value,
      tension:this.f.tension.value,
      categorieMaintenance:this.f.categorieMaintenance.value,
      unit: this.f.unit.value,
      periode:this.f.periode.value,
    }
    this.periodiciteService.add(periodicite).subscribe(
        (periodicite) => {
          if (periodicite) {
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Ajouter',
                  detail: 'La reference a été ajouté avec succès.',
                  key: 'top'
                });
            this.dialogRef.close();
          }
        },
        () => {
          this.messageService.add(
              {
                severity: 'error',
                summary: 'Ajouter',
                detail: 'Il y a eu une erreur lors de l\'ajout',
                key: 'top'
              });
          this.dialogRef.close();
        }
    )
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formPeriodicite.value) {
      this.addPeriodicite();
    }
  }
}
