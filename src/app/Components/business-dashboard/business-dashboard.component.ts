import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-dashboard',
  templateUrl: './business-dashboard.component.html',
  styleUrl: './business-dashboard.component.scss'
})
export class BusinessDashboardComponent implements OnInit {

  

   summaryCards = [
    { title: 'Total Products', value: 1480, subtitle: 'All items in inventory' },
    { title: 'Out of Stock', value: 37, subtitle: 'Items that need restocking' },
    { title: 'Total Sales (Today)', value: 322, subtitle: 'Units sold' },
    { title: 'Revenue (Today)', value: '$7,840', subtitle: 'Sales income' }
  ];

  lowStockItems = [
    { name: 'Printer Ink', stock: 4 },
    { name: 'Mouse', stock: 6 },
    { name: 'USB Cable', stock: 3 }
  ];

  notifications = [
    'Inventory backup completed.',
    'Product X is about to expire.',
    'New supplier added.',
    'Monthly report is ready.'
  ];

  recentTransactions = [
    { date: '2025-05-10', product: 'Keyboard', qty: 10, type: 'Sale', status: 'Completed' },
    { date: '2025-05-10', product: 'Monitor', qty: 5, type: 'Purchase', status: 'Received' },
    { date: '2025-05-09', product: 'Laptop', qty: 2, type: 'Sale', status: 'Completed' }
  ];

  ngOnInit(): void {
    
  }

}
