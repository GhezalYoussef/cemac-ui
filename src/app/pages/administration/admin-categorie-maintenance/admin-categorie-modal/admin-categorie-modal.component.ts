import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {CategorieMaintenance} from "../../../../models/categorie-maintenance.model";
import {CategorieMaintenanceService} from "../../../../services/categorie-maintenance.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PanelModule} from "primeng/panel";
import {ToastModule} from "primeng/toast";
import {ELigne} from "../../../../models/enum/ELigne.enum";
import {InputNumberModule} from "primeng/inputnumber";
import {ToggleButtonModule} from "primeng/togglebutton";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-admin-categorie-modal',
  standalone: true,
    imports: [
        ButtonModule,
        ConfirmDialogModule,
        DropdownModule,
        InputTextModule,
        MessageModule,
        PanelModule,
        ReactiveFormsModule,
        ToastModule,
        InputNumberModule,
        ToggleButtonModule,
        FormsModule,
        CommonModule,
    ],
  templateUrl: './admin-categorie-modal.component.html',
  styleUrl: './admin-categorie-modal.component.scss'
})
export class AdminCategorieModalComponent implements OnInit {

  formCategorieMaintenance ?: FormGroup;
  categorieMaintenance ?: CategorieMaintenance;
  typeLigneList : string[] = [ELigne.CLASSIQUE, ELigne.LGV];
  typeCategorieList : string[] = [];
  selecetCategorie: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private messageService: MessageService,
              private categorieMaintenanceService: CategorieMaintenanceService) {

    this.categorieMaintenance = this.dialogConfig.data.categorieMaintenance;
    this.typeCategorieList = this.dialogConfig.data.typeCategorieList;
    this.formCategorieMaintenance = this.formBuilder.group({
      typeLigne:['', Validators.required],
      pantoMin:['', Validators.required],
      pantoMax:['', Validators.required],
      vitesseMin:['', Validators.required],
      vitesseMax:['', Validators.required],
      categorieMaintenance:['', Validators.required],
    });
  }

  get f() {
    return this.formCategorieMaintenance.controls;
  }

  ngOnInit(): void {
    if (this.categorieMaintenance !== undefined) {
      this.f.typeLigne.setValue(this.categorieMaintenance.typeLigne),
      this.f.pantoMin.setValue(this.categorieMaintenance.pantoMin),
      this.f.pantoMax.setValue(this.categorieMaintenance.pantoMax),
      this.f.vitesseMin.setValue(this.categorieMaintenance.vitesseMin),
      this.f.vitesseMax.setValue(this.categorieMaintenance.vitesseMax),
      this.f.categorieMaintenance.setValue(this.categorieMaintenance.categorieMaintenance)
    }
  }

  addCategorieMaintenance() {
    const categorieMaintenance: CategorieMaintenance = {
      id: this.categorieMaintenance !== undefined ? this.categorieMaintenance.id : null,
      typeLigne:this.f.typeLigne.value,
      pantoMin:this.f.pantoMin.value,
      pantoMax:this.f.pantoMax.value,
      vitesseMin:this.f.vitesseMin.value,
      vitesseMax:this.f.vitesseMax.value,
      categorieMaintenance:this.f.categorieMaintenance.value
    }
    this.categorieMaintenanceService.add(categorieMaintenance).subscribe(
        (categorieMaintenance) => {
          if (categorieMaintenance) {
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Ajouter',
                  detail: 'La categorie a été ajouté avec succès.',
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
                detail: 'Il y a eu une erreur lors de l\'ajout de la categorie.',
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
    if (this.formCategorieMaintenance.value) {
      this.addCategorieMaintenance();
    }
  }
}
