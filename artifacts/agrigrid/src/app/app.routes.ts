import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'AgriGrid – Smart Agriculture Decision Platform',
  },
  {
    path: 'app',
    loadComponent: () => import('./layouts/shell/shell.component').then(m => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard – AgriGrid',
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.component').then(m => m.MapComponent),
        title: 'Plot Map – AgriGrid',
      },
      {
        path: 'ai',
        loadComponent: () => import('./pages/ai/ai.component').then(m => m.AiComponent),
        title: 'AI Recommendations – AgriGrid',
      },
      {
        path: 'sensing',
        loadComponent: () => import('./pages/sensing/sensing.component').then(m => m.SensingComponent),
        title: 'Remote Sensing – AgriGrid',
      },
      {
        path: 'irrigation',
        loadComponent: () => import('./pages/irrigation/irrigation.component').then(m => m.IrrigationComponent),
        title: 'Smart Irrigation – AgriGrid',
      },
      {
        path: 'blockchain',
        loadComponent: () => import('./pages/blockchain/blockchain.component').then(m => m.BlockchainComponent),
        title: 'Blockchain Ledger – AgriGrid',
      },
      {
        path: 'sustainability',
        loadComponent: () => import('./pages/sustainability/sustainability.component').then(m => m.SustainabilityComponent),
        title: 'Sustainability – AgriGrid',
      },
      {
        path: 'problems',
        loadComponent: () => import('./pages/problems/problems.component').then(m => m.ProblemsComponent),
        title: 'Problems & Solutions – AgriGrid',
      },
      {
        path: 'architecture',
        loadComponent: () => import('./pages/architecture/architecture.component').then(m => m.ArchitectureComponent),
        title: 'System Architecture – AgriGrid',
      },
      {
        path: 'twin',
        loadComponent: () => import('./pages/twin/twin.component').then(m => m.TwinComponent),
        title: 'Digital Twin – AgriGrid',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
