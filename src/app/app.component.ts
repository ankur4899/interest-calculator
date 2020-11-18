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
  totalAmount;
  showProjection = false;
  interestTable=[]


  paymentFrequency = [
    { year: 2, roi: 6 },
    { year: 3, roi: 7 },
    { year: 5, roi: 8 },
  ];

  rateOfInterest: { year: number; roi: number; }[];
  roi = 0;

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Bond Yield Input Form
   */
  createForm(): void {
    this.emiForm = new FormGroup({
      amount: new FormControl(''),
      year: new FormControl(''),
      roi: new FormControl('')
    });
  }

  /**
   * On Payment Frequency Changes
   * @param evt
   */
  onYearChange(evt): void {
    const year = this.emiForm.value.year;
    this.rateOfInterest = this.paymentFrequency.filter(element => element.year == year);
    this.emiForm.get('roi').setValue(this.rateOfInterest[0].roi);
    this.interestTable = [];
  }

  /**
   * On Calculate Button Click
   */
  onCalculate(): void {
    this.interestTable = [];
    const data = this.emiForm.value;

    this.roi=data.roi;
    this.totalInterest = this.simpleInterest(data.amount, (data.roi / 100), data.year).toFixed(2);
    this.initialBalance = data.amount.toFixed(2);
    this.totalAmount = (parseFloat(this.initialBalance) + parseFloat(this.totalInterest)).toFixed(2);
    this.prepareTable(data);
    this.showProjection = true;
  }

  prepareTable(data):void{
   const yearInterest = this.simpleInterest(data.amount, (data.roi / 100), 1).toFixed(2)
   let interestBalance = this.initialBalance;
   let totalInterest:any = 0;
   for(let i=0;i<data.year;i++){
     let obj = {
      sNo:0,
      yearDepo:'0.00',
      yearInterest:yearInterest,
      totalDeposits:this.initialBalance,
      totalInterest:'',
      balance:''
    }
    
    obj.balance = (parseFloat(interestBalance)+parseFloat(yearInterest)).toFixed(2);
    obj.totalInterest =(parseFloat(totalInterest)+parseFloat(yearInterest)).toFixed(2);
    interestBalance = obj.balance;
    totalInterest = obj.totalInterest
    obj.sNo = i+1;
    this.interestTable.push(obj)
   }
  }

  /**
   * Compount Interest Calculation
   * @param principal
   * @param rate
   * @param time
   * @param frequency
   */
  compoundInterest(principal, rate, time, frequency = 1): any {
    const amount = principal * (Math.pow((1 + (rate / frequency)), (frequency * time)));
    const interest = amount - principal;
    return interest;
  }

  /**
   * Simple Interest Calculation
   * @param principal
   * @param rate
   * @param time
   */
  simpleInterest(principal, rate, time): any {
    const amount = principal * rate * time;
    const interest = amount;
    return interest;
  }
}
