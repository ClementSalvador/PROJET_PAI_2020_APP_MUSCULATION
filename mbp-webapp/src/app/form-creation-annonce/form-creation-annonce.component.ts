import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TypeSeance} from '../models/TypeSeance.model';
import {TypeSeanceService} from '../services/TypeSeance.service';
import {Advert} from '../models/Advert.model';
import {AdvertService} from '../services/Advert.service';
import {CurrentUser} from '../models/CurrentUser.model';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-form-creation-annonce',
  templateUrl: './form-creation-annonce.component.html',
  styleUrls: ['./form-creation-annonce.component.scss']
})
export class FormCreationAnnonceComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  obsTypeSeance: Observable<TypeSeance[]>;
  isWait: boolean;
  currentUser: CurrentUser;


  constructor(private formBuilder: FormBuilder, private typeSeanceService: TypeSeanceService, private advertService: AdvertService, private router: Router, private authService: AuthService) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      NomCreaAnnonce: ['', Validators.required],
      NiveauCreaAnnonce : ['', Validators.required],
      DescriptionCreaAnnonce: ['', Validators.required],
      DureeSeanceCreaAnnonce: ['', Validators.required],
      DateSeanceCreaAnnonce: ['', Validators.required],
      typeSeanceCreaAnnonce: ['', Validators.required]
    });
    this.getAllTypeSeances();
  }

  getAllTypeSeances() {
    this.obsTypeSeance = this.typeSeanceService.getTypeSeance();
  }

  onSubmitForm() {
    this.isWait = true;
    const formValue = this.loginForm.value;

    this.currentUser = this.authService.currentUserValue;

    function transformTimeIntoNumber(value: number) {
      const tmp1 = +(value.toString().split(':')[0]) * 60;
      const tmp2 = +(value.toString().split(':')[1]);
      return tmp1 + tmp2;
    }

    const newAdvert = new Advert(
      formValue.DescriptionCreaAnnonce,
      formValue.NiveauCreaAnnonce,
      transformTimeIntoNumber(formValue.DureeSeanceCreaAnnonce),
      formValue.NomCreaAnnonce,
      formValue.DateSeanceCreaAnnonce,
      +formValue.typeSeanceCreaAnnonce,
      +this.currentUser.userId
    );
    this.errorMessage = '';
    this.advertService.createAdvert(newAdvert).subscribe(res => {
        this.isWait = false;
        this.router.navigate(['/']);
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = err.error.message;
      }
    );
  }
}
