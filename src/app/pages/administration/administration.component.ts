import {Component, OnInit} from '@angular/core';
import {TemplateModule} from "@tec/condor/components";
import {TabViewModule} from "primeng/tabview";
import {AdminUtilisateurComponent} from "./admin-utilisateur/admin-utilisateur.component";
import {AdminProfilComponent} from "./admin-profil/admin-profil.component";
import {AdminCategorieMaintenanceComponent} from "./admin-categorie-maintenance/admin-categorie-maintenance.component";
import {AdminCatenaireComponent} from "./admin-catenaire/admin-catenaire.component";
import {AdminFamilleCatenaireComponent} from "./admin-famille-catenaire/admin-famille-catenaire.component";
import {AdminPeriodiciteComponent} from "./admin-periodicite/admin-periodicite.component";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-administration',
  standalone: true,
    imports: [
        TemplateModule,
        TabViewModule,
        AdminUtilisateurComponent,
        AdminProfilComponent,
        AdminCategorieMaintenanceComponent,
        AdminCatenaireComponent,
        AdminFamilleCatenaireComponent,
        AdminPeriodiciteComponent
    ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent implements OnInit{

    constructor(private titleService: Title) {
    }

    ngOnInit(): void {
        this.titleService.setTitle('mode admin');
    }

}
