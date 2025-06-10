// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';  // <-- Import MatCardModule

import { AppComponent } from './app.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';  // <-- Import ConfirmDialogComponent

import { AppRoutingModule } from './app-routing.module';

import { userReducer } from './store/user.reducer';
import { UserEffects } from './store/user.effects';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { VisitorCounterComponent } from './visitors/visitor-counter/visitor-counter.component';
import { VisitorInfoComponent } from './visitors/visitor-info/visitor-info.component';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    UserListComponent,
    HomeComponent,
    AboutComponent,
    ConfirmDialogComponent,
    VisitorCounterComponent,
    VisitorInfoComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({ users: userReducer }),
    EffectsModule.forRoot([UserEffects]),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
