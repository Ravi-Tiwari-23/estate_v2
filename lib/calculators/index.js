export const number = (value) => Math.max(0, Number(value) || 0);

export function calculateEmi({ loanAmount, interestRate, tenureYears }) {
  const principal = number(loanAmount), monthlyRate = number(interestRate) / 1200, payments = Math.max(1, Math.round(number(tenureYears) * 12));
  const emi = monthlyRate ? principal * monthlyRate * (1 + monthlyRate) ** payments / ((1 + monthlyRate) ** payments - 1) : principal / payments;
  const totalPayment = emi * payments;
  return { principal, monthlyRate, payments, emi: Math.round(emi), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalPayment - principal) };
}

export function calculateTrueCost({ propertyPrice, downPayment, stampDuty=0, registration=0, brokerage=0, gst=0, parking=0, maintenanceDeposit=0, interiors=0, otherCharges=0, interestRate, tenureYears }) {
  const price = number(propertyPrice), loanAmount = Math.max(0, price - number(downPayment));
  const loan = calculateEmi({ loanAmount, interestRate, tenureYears });
  const upfrontCharges = [stampDuty,registration,brokerage,gst,parking,maintenanceDeposit,interiors,otherCharges].reduce((sum,value)=>sum+number(value),0);
  return { propertyPrice:price, loanAmount, ...loan, upfrontCharges, additionalCosts:upfrontCharges+loan.totalInterest, trueCost:price+upfrontCharges+loan.totalInterest };
}

export function calculateAffordability({ monthlyIncome, coApplicantIncome=0, otherIncome=0, monthlyExpenses, existingEmi=0, otherObligations=0, savings=0, downPayment, emergencyFund=0, propertyPrice, interestRate, tenureYears }) {
  const totalIncome=number(monthlyIncome)+number(coApplicantIncome)+number(otherIncome);
  const loan=calculateEmi({loanAmount:Math.max(0,number(propertyPrice)-number(downPayment)),interestRate,tenureYears});
  const availableBeforeEmi=totalIncome-number(monthlyExpenses)-number(existingEmi)-number(otherObligations);
  const cashRemaining=availableBeforeEmi-loan.emi;
  const emiBurden=totalIncome ? ((number(existingEmi)+loan.emi)/totalIncome)*100 : 100;
  const savingsRemaining=number(savings)-number(downPayment);
  const status=emiBurden<=35&&cashRemaining>0&&savingsRemaining>=number(emergencyFund)?'Comfortable':emiBurden<=50&&cashRemaining>=0?'Stretch':'High Pressure';
  return { ...loan,totalIncome,availableBeforeEmi,cashRemaining,emiBurden,savingsRemaining,status };
}

export function calculateRentalRoi({ propertyPrice, monthlyRent, annualMaintenance=0, propertyTax=0, vacancyPercent=0, annualExpenses=0 }) {
  const price=number(propertyPrice), grossRent=number(monthlyRent)*12, expenses=number(annualMaintenance)+number(propertyTax)+number(annualExpenses), vacancyLoss=grossRent*(number(vacancyPercent)/100), netIncome=grossRent-expenses-vacancyLoss;
  return { grossRent, grossYield:price?(grossRent/price)*100:0, expenses, vacancyLoss, netIncome, netYield:price?(netIncome/price)*100:0 };
}

export function calculateRisk({ emiBurden, cashRemaining, savingsRemaining, emergencyFund, possessionStatus, netYield }) {
  const flags=[]; if(number(emiBurden)>50) flags.push('EMI burden is above the recommended comfort range.'); if(number(cashRemaining)<0) flags.push('The new EMI would leave a monthly cash shortfall.'); if(number(savingsRemaining)<number(emergencyFund)) flags.push('Savings after purchase would be below your preferred emergency reserve.'); if(possessionStatus==='Under Construction') flags.push('Under-construction status can add timing and delivery uncertainty.'); if(number(netYield)>0&&number(netYield)<3) flags.push('Estimated rental return is limited under these assumptions.');
  const level=flags.length>=3?'High Risk':flags.length>=1?'Moderate Risk':'Low Risk'; return { level, flags };
}

export function calculateBuyVsRent({ propertyPrice, downPayment, interestRate, tenureYears, registration=0, annualMaintenance=0, propertyTax=0, monthlyRent, securityDeposit=0, rentIncrease=0, years=5 }) {
  const months=Math.max(1,number(years)*12), loan=calculateEmi({loanAmount:Math.max(0,number(propertyPrice)-number(downPayment)),interestRate,tenureYears});
  const buyingInitial=number(downPayment)+number(registration), buyingTotal=buyingInitial+loan.emi*months+(number(annualMaintenance)+number(propertyTax))*number(years);
  let rentTotal=number(securityDeposit); for(let year=0;year<number(years);year+=1) rentTotal+=number(monthlyRent)*12*(1+number(rentIncrease)/100)**year;
  const monthlyDifference=loan.emi-number(monthlyRent); return { ...loan,buyingInitial,buyingTotal,rentingInitial:number(securityDeposit),rentTotal,monthlyDifference, conclusion:months>=60&&monthlyDifference<=(number(monthlyRent)*1.5)?'Buying becomes more competitive if you plan to hold the property for a longer period.':'Renting currently preserves more monthly cash flow under these assumptions.' };
}
