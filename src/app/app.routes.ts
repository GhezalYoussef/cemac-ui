import { Routes } from '@angular/router';
import {ModeAnalyseComponent} from "./pages/mode-analyse/mode-analyse.component";
import {ModeSaisieComponent} from "./pages/mode-saisie/mode-saisie.component";
import {ListRequetesComponent} from "./pages/list-requetes/list-requetes.component";
import {AdministrationComponent} from "./pages/administration/administration.component";
// import {CustomGuardService} from "./services/custom-guard.service";
// import {CustomRoleGuardService} from "./services/custom-role-guard.service";
// import {EProfil} from "./models/enum/EProfil.enum";
// import {AuthGuardService} from "@tec/condor/services";

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  // { path: 'requetes', component : ListRequetesComponent, canActivate: [CustomGuardService] },
  // { path: 'saisie', component : ModeSaisieComponent , canActivate: [CustomGuardService]},
  // { path: 'analyse', component : ModeAnalyseComponent, canActivate: [CustomGuardService] },
  // { path: 'administration', component : AdministrationComponent ,canActivate: [CustomRoleGuardService], data:{roles: [EProfil.ADMIN]} },
  // { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent), canActivate: [AuthGuardService] },

  { path: 'requetes', component : ListRequetesComponent },
  { path: 'saisie', component : ModeSaisieComponent},
  { path: 'analyse', component : ModeAnalyseComponent},
  { path: 'administration', component : AdministrationComponent },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)},

  { path: "autologin", loadChildren: () => import("@tec/condor/services").then((m) => m.AutoLoginModule) },
  { path: 'logout', loadComponent: () => import('@tec/condor/pages').then(c => c.LogoutComponent) },
  { path: 'error', loadComponent: () => import('@tec/condor/pages').then(c => c.ErrorComponent) },
  { path: 'blank', loadComponent: () => import('@tec/condor/pages').then(c => c.BlankComponent) },
  { path: 'pagenotfound', loadComponent: () => import('@tec/condor/pages').then(c => c.PageNotFoundComponent) },
  { path: "**", redirectTo: '/pagenotfound' },
  // Routes accessible aux utilisateurs authentifiés (via AuthGuardService) :
  // { path: '...',  loadComponent: () => import('./chemin/du/module').then(c=> c.ComponentClass)',
  //    canActivate: [AuthGuardService] }
  // Routes accessible aux utilisateurs ayant un des rôles spécifiés (via RoleGuardService) :
  // { path: '...',  loadChildren: () => import('./chemin/du/module').then(m => m.ModuleClass)',
  //    canActivate: [RoleGuardService], data: { roles: 'ROLE_...,ROLE_...' } }
];
