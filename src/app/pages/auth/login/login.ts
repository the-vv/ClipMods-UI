import { Component, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PocketbaseService } from '../../../services/pocketbase-service';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [InputTextModule, RouterLink, ButtonModule, ReactiveFormsModule, MessageModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly pocketbaseService = inject(PocketbaseService);
  private readonly router = inject(Router);

  loading = signal(false);
  loginForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loginError = signal<string | null>(null);

  onSubmit() {
    this.loginError.set(null);
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    this.pocketbaseService.login(email!, password!)
      .then((res) => {
        console.log('Login successful', res);
        this.loading.set(false);
        this.router.navigate(['/']);
      })
      .catch(error => {
        // Handle login error
        console.error('Login failed', error);
        this.loading.set(false);
        this.loginError.set('Login failed. Please check your credentials and try again.');
      });
  }
}
