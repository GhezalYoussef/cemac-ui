import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {Catenaire} from "../../../../models/catenaire.model";
import {CatenaireService} from "../../../../services/catenaire.service";
import {FamilleCatenaireService} from "../../../../services/famille-catenaire.service";
import {FamilleCatenaire} from "../../../../models/famille-catenaire.model";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
import {PanelModule} from "primeng/panel";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-admin-catenaire-modal',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    PanelModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './admin-catenaire-modal.component.html',
  styleUrl: './admin-catenaire-modal.component.scss'
})
export class AdminCatenaireModalComponent implements OnInit {

  formCatenaire ?: FormGroup;
  catenaire ?: Catenaire;
  familleCatenaireList: FamilleCatenaire[] = [];

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private messageService: MessageService,
              private catenaireService: CatenaireService,
              private familleCatenaireService: FamilleCatenaireService) {

    this.catenaire = this.dialogConfig.data.catenaire;
    this.formCatenaire = this.formBuilder.group({
      familleCatenaire:['', Validators.required],
      libelle:['', Validators.required]
    });

  }

  get f() {
    return this.formCatenaire.controls;
  }

  ngOnInit(): void {
    if (this.catenaire !== undefined) {
      this.f.familleCatenaire.setValue(this.catenaire.familleCatenaire);
      this.f.libelle.setValue(this.catenaire.libelle);
    }
    this.getFamilleCatenaireList();
  }

  getFamilleCatenaireList() {
    this.familleCatenaireService.findAll().subscribe(
        res => {
          this.familleCatenaireList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'warn',
                summary: 'Charger',
                detail: 'Erreur lors du chargement de la liste.',
                key: 'top'
              });
        })
  }

  addCatenaire() {
    const catenaire: Catenaire = {
      id: this.catenaire !== undefined ? this.catenaire.id : null,
      periodicites: [],
      familleCatenaire: this.f.familleCatenaire.value,
      libelle: this.f.libelle.value
    }
    this.catenaireService.add(catenaire).subscribe(
        (catenaire) => {
          if (catenaire) {
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Ajouter',
                  detail: 'La catenaire a été ajouté avec succès.',
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
    if (this.formCatenaire.value) {
      this.addCatenaire();
    }
  }
}
