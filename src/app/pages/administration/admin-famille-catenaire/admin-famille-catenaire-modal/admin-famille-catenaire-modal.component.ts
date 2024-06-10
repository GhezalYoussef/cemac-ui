import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {CustomAuthService} from "../../../../services/custom-auth.service";
import {FamilleCatenaire} from "../../../../models/famille-catenaire.model";
import {FamilleCatenaireService} from "../../../../services/famille-catenaire.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-admin-famille-catenaire-modal',
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
  templateUrl: './admin-famille-catenaire-modal.component.html',
  styleUrl: './admin-famille-catenaire-modal.component.scss'
})
export class AdminFamilleCatenaireModalComponent implements OnInit {


  formFamilleCatenaire ?: FormGroup;
  familleCatenaire ?: FamilleCatenaire;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private messageService: MessageService,
              private familleCatenaireService: FamilleCatenaireService,
              private customAuthService : CustomAuthService) {

    this.familleCatenaire = this.dialogConfig.data.familleCatenaire;
    this.formFamilleCatenaire = this.formBuilder.group({
      typeLigne: ['', Validators.required],
      libelle: ['', Validators.required]
    });

  }

  get f() {
    return this.formFamilleCatenaire.controls;
  }

  ngOnInit(): void {
    if (this.familleCatenaire !== undefined) {
      this.f.libelle.setValue(this.familleCatenaire.libelle);
    }
  }

  addUtilisateur() {
    const familleCatenaire: FamilleCatenaire = {
      id: this.familleCatenaire !== undefined ? this.familleCatenaire.id : null,
      typeLigne: this.f.typeLigne.value,
      libelle: this.f.libelle.value
    }
    this.familleCatenaireService.add(familleCatenaire).subscribe(
        (familleCatenaire) => {
          if (familleCatenaire) {
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Ajouter',
                  detail: 'L\'ajout avec succès.',
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
                detail: 'Il y a eu une erreur lors de l\'ajout.',
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
    if (this.formFamilleCatenaire.value) {
      this.addUtilisateur();
    }
  }
}
