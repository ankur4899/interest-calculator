import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'interest-calculator';
  emiForm: FormGroup;
  totalInterest = '';
  initialBalance = '';
  totalAmount = 0;
  showProjection = false;


  paymentFrequency = [
    { year: 2, roi: 6 },
    { year: 3, roi: 7 },
    { year: 5, roi: 8 },
  ];

  rateOfInterest: { year: number; roi: number; }[];

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.emiForm = new FormGroup({
      amount: new FormControl(''),
      year: new FormControl(''),
      roi: new FormControl('')
    });
  }

  onYearChange(evt): void {
    const year = this.emiForm.value.year;
    this.rateOfInterest = this.paymentFrequency.filter(element => element.year == year);
    this.emiForm.get('roi').setValue(this.rateOfInterest[0].roi);
  }

  onCalculate(): void {
    const data = this.emiForm.value;

    this.totalInterest = this.compoundInterest(data.amount, (data.roi / 100), data.year).toFixed(2);
    this.initialBalance = data.amount;
    this.totalAmount = parseInt(this.initialBalance, 10) + parseFloat(this.totalInterest);
    this.showProjection = true;
  }

  compoundInterest(principal, rate, time, frequency = 1): any {
    const amount = principal * (Math.pow((1 + (rate / frequency)), (frequency * time)));
    const interest = amount - principal;
    return interest;
  }
}
