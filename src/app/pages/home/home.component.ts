import { CommonModule } from '@angular/common';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CdSillonComponent, TemplateModule } from '@tec/condor/components';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {RequeteService} from "../../services/requete.service";
import {MessageService} from "primeng/api";
import {SharedService} from "../../services/shared.service";
import {Title} from "@angular/platform-browser";

@Component({
  standalone: true,
  templateUrl: './home.component.html',
  styles: [`
  .cd-sillon {
    margin: 0 !important;
    padding: 0 !important;
  }
  .cd-sillon .cd-sillon-title {
    font-size: 3rem !important;
  }
  .uppercase {
    text-transform: uppercase;
  }
  `],
  imports: [CommonModule, CdSillonComponent, TemplateModule, FontAwesomeModule, CardModule, ButtonModule, RouterLink],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit{

  constructor(private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Accueil');
  }
  faCheck = faCheck;
}
