import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./pages/items/items.module').then(m => m.ItemsPageModule)
  },
  { path: 'single-item/:id', loadChildren: './pages/single-item/single-item.module#SingleItemPageModule' },
  { path: 'add-item', loadChildren: './pages/add-item/add-item.module#AddItemPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
