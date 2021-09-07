import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  authForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get getFormValues() { return this.authForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.login(this.getFormValues.email.value, this.getFormValues.password.value).subscribe(
      (result) => {
        console.log("Result : " + result);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error["error"]["message"]);
        this.alertService.error(error["error"]["message"]);
        this.loading = false;
      }
    );
  }
}
