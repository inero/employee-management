import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  
  public employeeDialog: boolean;
  public employees: Employee[];
  public selectedEmployees: Employee[];
  public employee: Employee;
  public submitted: boolean;

  constructor(private employeeService: EmployeeService, private messageService: MessageService, private confirmationService: ConfirmationService) { 
    this.employeeDialog = false;
    this.employees = [];
    this.selectedEmployees = [];
    this.employee = {};
    this.submitted = false;
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((data: Employee) => {
      this.employees = Object.values(data);
    });
  }

  openNew() {
    this.employee = {};
    this.submitted = false;
    this.employeeDialog = true;
  }

  editEmployee(employee: Employee) {
    this.employee = { ...employee };
    this.employeeDialog = true;
  }

  deleteEmployee(employee: Employee) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + employee.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        this.employeeService.deleteEmployee(employee?.id || '').subscribe((data: Employee) => {
          this.employees = this.employees.filter(val => val.id !== employee.id);
          this.employee = {};
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
        });
      }
    });
  }

  hideDialog() {
    this.employeeDialog = false;
    this.submitted = false;
  }

  saveEmployee() {
    this.submitted = true;

    if (this.employee?.name?.trim()) {
      if (this.employee.id) {
        const empId = this.employee.id;
        this.employeeService.editEmployee(this.employee, empId).subscribe((data: Employee) => {
          this.hideDialog();
          this.employees[this.findIndexById(empId)] = data;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Updated', life: 3000 });
        });
      }
      else {
        this.employee.id = this.createId();
        this.employee.code = this.createId();
        this.employee.image = '';
        this.employee.status = 'Active';

        this.employeeService.createEmployee(this.employee).subscribe((data: Employee) => {
          this.employees.push(data);
          this.hideDialog();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Employee Created', life: 3000 });
        });
      }
      this.employees = [...this.employees];
      this.employeeDialog = false;
      this.employee = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
