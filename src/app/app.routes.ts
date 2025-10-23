import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RootPageComponent } from './pages/root-page/root-page.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: RootPageComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
      },{
        path: 'statistics/results',
        component: SearchResultsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouters {}
