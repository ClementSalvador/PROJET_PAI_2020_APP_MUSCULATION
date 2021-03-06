import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TypeSeanceService} from '../services/TypeSeance.service';
import {AdvertService} from '../services/Advert.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {TypeSeance} from '../models/TypeSeance.model';
import {CurrentUser} from '../models/CurrentUser.model';
import {AdvertEntity} from '../models/AdvertEntity.model';
import {AdvertEdit} from '../models/AdvertEdit.model';

@Component({
  selector: 'app-edit-advert',
  templateUrl: './edit-advert.component.html',
  styleUrls: ['./edit-advert.component.scss']
})
export class EditAdvertComponent implements OnInit {

  editForm: FormGroup;
  errorMessage: string;
  obsTypeSeance: Observable<TypeSeance[]>;
  isWait: boolean;
  currentUser: CurrentUser;
  preAid: string;
  currentAdvert: AdvertEntity;
  toDate = new Date();

  constructor(private formBuilder: FormBuilder, private typeSeanceService: TypeSeanceService, private advertService: AdvertService, private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.preAid = this.router.url.split('/').pop();
    this.initForm();
    this.getAdvertInfos();
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      NomCreaAnnonce: ['', [Validators.required, Validators.maxLength(50)]],
      NiveauCreaAnnonce : ['', Validators.required],
      DescriptionCreaAnnonce: ['', [Validators.required, Validators.maxLength(500)]],
      DureeSeanceCreaAnnonce: ['', Validators.required],
      DateSeanceCreaAnnonce: ['', Validators.required],
      typeSeanceCreaAnnonce: ['', Validators.required]
    });
    this.getAllTypeSeances();
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  transformTimeIntoNumber(value: number) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return this.pad(hours, 2) + ':' + this.pad(minutes, 2);
  }

  getAdvertInfos(){
    this.advertService.getAdvertById(+this.preAid).subscribe(res => {
      this.currentAdvert = res;
      this.editForm.controls['DescriptionCreaAnnonce'].setValue(this.currentAdvert.description);
      this.editForm.controls['NomCreaAnnonce'].setValue(this.currentAdvert.nom);
      this.editForm.controls['NiveauCreaAnnonce'].setValue(this.currentAdvert.niveauPratique);
      this.editForm.controls['DureeSeanceCreaAnnonce'].setValue(this.transformTimeIntoNumber(this.currentAdvert.dureeSeance));
      this.editForm.controls['DateSeanceCreaAnnonce'].setValue(this.currentAdvert.dateSeance);
      this.editForm.controls['typeSeanceCreaAnnonce'].setValue(this.currentAdvert.idSeance.idSeance);
    });
  }

  getAllTypeSeances() {
    this.obsTypeSeance = this.typeSeanceService.getTypeSeance();
  }

  onSubmitForm() {
    this.isWait = true;
    const formValue = this.editForm.value;

    function transformTimeIntoNumber(value: number) {
      const tmp1 = +(value.toString().split(':')[0]) * 60;
      const tmp2 = +(value.toString().split(':')[1]);
      return tmp1 + tmp2;
    }

    console.log(formValue.typeSeanceCreaAnnonce);

    const newAdvert = new AdvertEdit(
      formValue.DescriptionCreaAnnonce,
      formValue.NiveauCreaAnnonce,
      transformTimeIntoNumber(formValue.DureeSeanceCreaAnnonce),
      formValue.NomCreaAnnonce,
      formValue.DateSeanceCreaAnnonce,
      +formValue.typeSeanceCreaAnnonce,
      +this.preAid
    );
    this.errorMessage = '';
    this.advertService.updateAdvert(newAdvert).subscribe(response =>{
      this.router.navigate(['./advertListProprio']);});
  }

}
