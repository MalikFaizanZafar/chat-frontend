import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { ChatGQLComponent } from './chat-gql/chat-gql.component';
import { GraphQLConfigModule } from './apollo.config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent,
    ChatGQLComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBVuIpEpE4Ke9xam26eRzVZItTslj6iTMY",
      authDomain: "subquch-d4369.firebaseapp.com",
      databaseURL: "https://subquch-d4369.firebaseio.com",
      projectId: "subquch-d4369",
      storageBucket: "gs://subquch-d4369.appspot.com",
      messagingSenderId: "54989238851"
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'chat', component: ChatComponent},
      { path: 'chat-gql', component: ChatGQLComponent}
    ]),
    GraphQLConfigModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
