import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  // convenience getter for easy access to form fields
  get getFormValues() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.userService.register(this.getFormValues.email.value,
      this.getFormValues.firstName.value,
      this.getFormValues.lastName.value,
      this.getFormValues.password.value).subscribe(
        (result) => {
          console.log("Result : " + result);
          this.alertService.success("User registration successful ! Please login.");
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500)

        },
        (error) => {
          console.log(error["error"]["message"]);
          this.alertService.error(error["error"]["message"]);
          this.loading = false;
        }
      );

  }

}
