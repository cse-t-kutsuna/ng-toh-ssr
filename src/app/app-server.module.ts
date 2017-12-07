import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    CommonModule,
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
  ],
  declarations: [],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
