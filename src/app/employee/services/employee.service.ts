import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee';
import { Observable } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient, private restService: RestService<Employee>) { }

  public getEmployees(): Observable<Employee> {
    return this.restService.get('employees', '');
  }

  public createEmployee(emp: Employee): Observable<Employee> {
    const employee: Employee = {
      id: this.generateCode(),
      code: this.generateCode(),
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      status: emp.status
    };
    employee.image = employee?.name?.toLocaleLowerCase().split(/[ ,]+/).join('-') + ".jpg";

    console.log(employee);
    
    return this.restService.post('employees', employee);
  }

  public deleteEmployee(id: string): Observable<Employee> {
    return this.restService.delete('employees', id);
  }

  public editEmployee(employee: Employee, id: string): Observable<Employee> {
    return this.restService.put('employees', employee, id);
  }

  public generateCode() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
