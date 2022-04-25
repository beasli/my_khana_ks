import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KitchenPicsPage } from './kitchen-pics.page';

const routes: Routes = [
  {
    path: '',
    component: KitchenPicsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KitchenPicsPage]
})
export class KitchenPicsPageModule {}
