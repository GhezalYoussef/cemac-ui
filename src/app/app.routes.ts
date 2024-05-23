import { Routes } from '@angular/router';
import {ModeAnalyseComponent} from "./pages/mode-analyse/mode-analyse.component";
import {ModeSaisieComponent} from "./pages/mode-saisie/mode-saisie.component";

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'analyse', component : ModeAnalyseComponent },
  { path: 'saisie', component : ModeSaisieComponent },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
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
