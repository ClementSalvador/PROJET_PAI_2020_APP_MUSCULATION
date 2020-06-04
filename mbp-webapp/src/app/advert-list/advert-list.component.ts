import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {AdvertService} from '../services/Advert.service';
import {AdvertItemList} from '../models/AdvertItemList.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeSeance } from '../models/TypeSeance.model';
import { TypeSeanceService } from '../services/TypeSeance.service';
import { SalleService } from '../services/Salle.service';
import { Salle } from '../models/Salle.model';
import { FormGroup, FormBuilder,FormControl} from '@angular/forms';

@Component({
  selector: 'app-advert-list',
  templateUrl: './advert-list.component.html',
  styleUrls: ['./advert-list.component.scss']
})
export class AdvertListComponent implements OnInit {

  @ViewChild('formFiltre') formFiltre:ElementRef;
  ItemsArray = [];
  obsTypeSeance: Observable<TypeSeance[]>;
  obsSalles: Observable<Salle[]>;
  filtreAnnonceForm: FormGroup;
  zoneFiltreVisible: boolean;
  
  constructor(public advertService: AdvertService, 
              private typeSeanceService: TypeSeanceService,
              private salleService: SalleService,
              private router: Router,
              private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.initAnnonces();
    this.initSelect();
    this.initForm();
    this.initVisibility();
  }

  initAnnonces(): void{
    this.advertService.getAdverts().subscribe((res: AdvertItemList[]) => {
      this.ItemsArray = res;
    });
  }

  initSelect(): void {
    this.obsTypeSeance = this.typeSeanceService.getTypeSeance();
    this.obsSalles = this.salleService.getSalles();
  }

  initForm(): void{
    this.filtreAnnonceForm = new FormGroup({
      date : new FormControl('test'),
      dureeMin : new FormControl(''),
      dureeMax : new FormControl(''),
      niveau : new FormControl(''),
      typeSeance : new FormControl(''),
      salle : new FormControl(''),
      sex : new FormControl('')
    });
  }

  initVisibility(): void{
    this.zoneFiltreVisible = false;
  }

  showZoneFiltre(): void{
    this.zoneFiltreVisible = !this.zoneFiltreVisible;
  }

  submitForm(): void{
    console.log("la on submit le formulaire et on aplique les filtres");
  }

  clearForm(): void{
    for(let i=0; i < this.formFiltre.nativeElement.elements.length-2;i++){
      this.formFiltre.nativeElement.elements[i].value = '';
    }
  }

  deleteAdvertById(aid: number){
    this.advertService.deleteAdvertById(aid);
    this.router.navigate(['/']);
  }
}
