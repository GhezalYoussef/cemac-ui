import {Component, OnInit} from '@angular/core';
import {
    AsyncValidatorFn,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import {Profil} from "../../../../models/profil.model";
import {Utilisateur} from "../../../../models/Utilisateur.model";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {UtilisateurService} from "../../../../services/utilisateur.service";
import {ProfilService} from "../../../../services/profil.service";
import {CustomAuthService} from "../../../../services/custom-auth.service";
import {catchError, map, Observable, of} from "rxjs";
import {MessageModule} from "primeng/message";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {ChipsModule} from "primeng/chips";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-admin-utilisateur-modal',
  standalone: true,
    imports: [
        MessageModule,
        DropdownModule,
        ButtonModule,
        PanelModule,
        ReactiveFormsModule,
        ChipsModule,
        ConfirmDialogModule,
        ToastModule

    ],
  templateUrl: './admin-utilisateur-modal.component.html',
  styleUrl: './admin-utilisateur-modal.component.scss'
})
export class AdminUtilisateurModalComponent implements OnInit {

  formUtilisateur ?: FormGroup;
  profilList: Profil[] = [];
  utilisateur ?: Utilisateur;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig,
              private messageService: MessageService,
              private userService: UtilisateurService,
              private profilService: ProfilService,
              private customAuthService : CustomAuthService) {

    this.utilisateur = this.dialogConfig.data.utilisateur;
    this.formUtilisateur = this.formBuilder.group({
      profil: ['', Validators.required],
      idSncf: ['', Validators.required, this.idSNCFExistsValidator(), 'blur'],
      nom: ['', Validators.required],
      prenom: ['', Validators.required]
    });
    this.formUtilisateur.get('idSncf').valueChanges.subscribe(value => {
      this.formUtilisateur.patchValue({ idSncf: value.toUpperCase() }, { emitEvent: false });
    });

  }

  get f() {
    return this.formUtilisateur.controls;
  }

  ngOnInit(): void {
    if (this.utilisateur !== undefined) {
      this.f.nom.setValue(this.utilisateur.nom);
      this.f.prenom.setValue(this.utilisateur.prenom);
      this.f.idSncf.setValue(this.utilisateur.idSncf);
      this.f.idSncf.disable();
      this.f.profil.setValue(this.utilisateur.profil);
    }
    this.getProfilList();
  }

  getProfilList() {
    this.profilService.getListProfil().subscribe(
        res => {
            this.profilList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'warn',
                summary: 'Charger',
                detail: 'Erreur lors du chargement de la liste des profils d\'utilisateurs.s',
                key: 'top'
              });
        })
  }


  private idSNCFExistsValidator(): AsyncValidatorFn {
    return (control: FormControl): Observable<ValidationErrors | null> => {
      return this.userService.isUtilisateur(control.value).pipe(
          map(exists => (exists ? { idExists : true } : null)),
          catchError(() => of(null))
      );
    };
  }

  addUtilisateur() {
    const utilisateur: Utilisateur = {
      id: this.utilisateur !== undefined ? this.utilisateur.id : null,
      profil: this.f.profil.value,
      idSncf: this.f.idSncf.value,
      nom: this.f.nom.value,
      prenom: this.f.prenom.value,
    }
    this.userService.addUtilisateur(utilisateur).subscribe(
        (utilisateur) => {
          if (utilisateur) {
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Ajouter',
                  detail: 'L\'utilisateur a été ajouté avec succès.',
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
                detail: 'Il y a eu une erreur lors de l\'ajout de l\'utilisateur.',
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
    if (this.formUtilisateur.value) {
      this.addUtilisateur();
    }
  }

}

