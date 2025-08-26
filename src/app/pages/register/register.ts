import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PocketbaseService } from '../../services/pocketbase-service';
import { Toaster } from '../../classes/toster';

@Component({
  selector: 'app-register',
  imports: [InputTextModule, ButtonModule, ReactiveFormsModule, MessageModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private readonly pocketbaseService = inject(PocketbaseService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loading = signal(false);
  registerForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator()
  });
  registerError = signal<string | null>(null);

  onSubmit() {
    this.registerError.set(null);
    if (this.registerForm.invalid) {
      if (this.registerForm.errors?.['mismatch']) {
        this.registerError.set('Passwords do not match');
      }
      return;
    }

    this.loading.set(true);
    const { email, password, name } = this.registerForm.value;

    this.pocketbaseService.register(name!, email!, password!)
      .then((res) => {
        this.loading.set(false);
        this.router.navigate(['/auth']);
        Toaster.showSuccess('Registration successful, please log in.');
      })
      .catch(error => {
        // Handle registration error
        console.error('Registration failed', error);
        this.loading.set(false);
        this.registerError.set('Registration failed. Please check your credentials and try again.');
      });
  }

  private passwordMatchValidator() {
    return (form: AbstractControl) => form.get('password')?.value === form.get('passwordConfirm')?.value
      ? null : { mismatch: true };
  }
}
