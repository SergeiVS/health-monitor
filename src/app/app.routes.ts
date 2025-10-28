import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RootPageComponent } from './pages/root-page/root-page.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { LogInComponent } from './pages/log-in/log-in.component';
import { authGuard } from './auth-guard';

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
        path: 'login',
        component: LogInComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'statistics',
        component: StatisticsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'statistics/results',
        component: SearchResultsComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouters {}
