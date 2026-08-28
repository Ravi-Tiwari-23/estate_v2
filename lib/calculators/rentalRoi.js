const safe = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export function calculateEMI(principal, annualRate, years) {
  const p = safe(principal), n = Math.round(safe(years) * 12);
  if (p <= 0 || n <= 0) return 0;
  const r = safe(annualRate) / 12 / 100;
  if (r === 0) return p / n;
  const factor = Math.pow(1 + r, n);
  return p * r * factor / (factor - 1);
}

export function calculateLoanBalance(principal, annualRate, years, paidMonths) {
  const p = safe(principal), n = Math.round(safe(years) * 12), paid = Math.min(n, Math.max(0, Math.round(safe(paidMonths))));
  if (!p || !n || paid >= n) return 0;
  const r = safe(annualRate) / 1200;
  if (!r) return p * (1 - paid / n);
  const factor = Math.pow(1 + r, n);
  return p * (factor - Math.pow(1 + r, paid)) / (factor - 1);
}

const normalize = (raw = {}) => ({
  propertyPrice:safe(raw.propertyPrice), trueAcquisitionCost:safe(raw.trueAcquisitionCost), monthlyRent:safe(raw.monthlyRent),
  otherMonthlyIncome:safe(raw.otherMonthlyIncome), securityDeposit:safe(raw.securityDeposit), vacancyRate:Math.min(100,safe(raw.vacancyRate)),
  propertyTax:safe(raw.propertyTax), societyCharges:safe(raw.societyCharges), insurance:safe(raw.insurance), repairReserve:safe(raw.repairReserve),
  managementMode:raw.managementMode === 'amount' ? 'amount' : 'percent', managementFeeAmount:safe(raw.managementFeeAmount), managementFeeRate:safe(raw.managementFeeRate),
  otherAnnualExpenses:safe(raw.otherAnnualExpenses), financed:Boolean(raw.financed), loanAmount:safe(raw.loanAmount), downPayment:safe(raw.downPayment),
  interestRate:safe(raw.interestRate), tenureYears:safe(raw.tenureYears), initialSetupCosts:safe(raw.initialSetupCosts), rentGrowthRate:safe(raw.rentGrowthRate),
  appreciationRate:safe(raw.appreciationRate), holdingYears:Math.max(1,Math.round(safe(raw.holdingYears)||5)), sellingCostRate:safe(raw.sellingCostRate),
  targetNetYield:safe(raw.targetNetYield), propertyType:raw.propertyType||'Apartment', propertyArea:safe(raw.propertyArea), location:raw.location||''
});

function operatingYear(f, annualIncome, vacancyRate=f.vacancyRate, repairReserve=f.repairReserve) {
  const vacancyLoss=annualIncome*vacancyRate/100, effectiveRentalIncome=annualIncome-vacancyLoss;
  const managementFee=f.managementMode==='percent'?effectiveRentalIncome*f.managementFeeRate/100:f.managementFeeAmount;
  const fixed=f.propertyTax+f.societyCharges+f.insurance+repairReserve+f.otherAnnualExpenses;
  const totalOperatingExpenses=fixed+managementFee, noi=effectiveRentalIncome-totalOperatingExpenses;
  return {vacancyLoss,effectiveRentalIncome,managementFee,totalOperatingExpenses,noi,expenseRatio:effectiveRentalIncome?totalOperatingExpenses/effectiveRentalIncome*100:0};
}

function requiredMonthlyRent(f, requiredNoi) {
  const keep=1-f.vacancyRate/100, managementKeep=f.managementMode==='percent'?1-f.managementFeeRate/100:1;
  const fixed=f.propertyTax+f.societyCharges+f.insurance+f.repairReserve+f.otherAnnualExpenses+(f.managementMode==='amount'?f.managementFeeAmount:0);
  const denominator=12*keep*managementKeep;
  if (denominator<=0) return 0;
  return Math.max(0,(requiredNoi+fixed)/denominator-f.otherMonthlyIncome);
}

export function calculateRentalROI(rawForm={}) {
  const form=normalize(rawForm), acquisitionCost=form.trueAcquisitionCost>0?form.trueAcquisitionCost:form.propertyPrice;
  const grossAnnualRent=form.monthlyRent*12, grossAnnualIncome=(form.monthlyRent+form.otherMonthlyIncome)*12;
  const op=operatingYear(form,grossAnnualIncome);
  const monthlyEMI=form.financed?calculateEMI(form.loanAmount,form.interestRate,form.tenureYears):0, annualDebtService=monthlyEMI*12;
  const annualCashFlow=op.noi-annualDebtService, monthlyCashFlow=annualCashFlow/12;
  const acquisitionCostsPaidFromCash=form.trueAcquisitionCost>form.propertyPrice?form.trueAcquisitionCost-form.propertyPrice:0;
  const cashInvested=form.financed?form.downPayment+acquisitionCostsPaidFromCash+form.initialSetupCosts:acquisitionCost+form.initialSetupCosts;
  const breakEvenRent=requiredMonthlyRent(form,annualDebtService), targetRent=requiredMonthlyRent(form,acquisitionCost*form.targetNetYield/100);
  const grossRentalYield=acquisitionCost?grossAnnualIncome/acquisitionCost*100:0, grossYieldOnListing=form.propertyPrice?grossAnnualIncome/form.propertyPrice*100:0;
  const netRentalYield=acquisitionCost?op.noi/acquisitionCost*100:0, cashOnCashReturn=cashInvested?annualCashFlow/cashInvested*100:0;
  const projection=[]; let cumulativeCashFlow=0;
  for(let year=1;year<=Math.max(10,form.holdingYears);year+=1){
    const annualIncome=grossAnnualIncome*Math.pow(1+form.rentGrowthRate/100,year-1), yearOp=operatingYear(form,annualIncome), cashFlow=yearOp.noi-annualDebtService;
    cumulativeCashFlow+=cashFlow;
    projection.push({year,annualRent:annualIncome,noi:yearOp.noi,annualCashFlow:cashFlow,cumulativeCashFlow,propertyValue:acquisitionCost*Math.pow(1+form.appreciationRate/100,year),loanBalance:form.financed?calculateLoanBalance(form.loanAmount,form.interestRate,form.tenureYears,year*12):0});
  }
  const hold=projection[form.holdingYears-1], sellingCosts=hold.propertyValue*form.sellingCostRate/100, netSaleProceeds=hold.propertyValue-sellingCosts-hold.loanBalance;
  const totalInvestmentGain=hold.cumulativeCashFlow+netSaleProceeds-cashInvested, totalROI=cashInvested?totalInvestmentGain/cashInvested*100:0;
  const annualizedReturn=cashInvested>0&&cashInvested+totalInvestmentGain>0?(Math.pow((cashInvested+totalInvestmentGain)/cashInvested,1/form.holdingYears)-1)*100:0;
  const cashFlowMargin=op.effectiveRentalIncome?annualCashFlow/op.effectiveRentalIncome:0;
  const healthParts={netYield:Math.min(30,Math.max(0,netRentalYield/8*30)),cashFlow:Math.min(30,Math.max(0,(cashFlowMargin+.1)/.4*30)),expenseLoad:Math.min(20,Math.max(0,(1-op.expenseRatio/100)*20)),vacancy:Math.min(20,Math.max(0,(1-form.vacancyRate/30)*20))};
  const healthScore=Math.round(Object.values(healthParts).reduce((a,b)=>a+b,0));
  const vacancyStress=operatingYear(form,grossAnnualIncome,Math.min(100,form.vacancyRate+5));
  const stressEMI=form.financed?calculateEMI(form.loanAmount,form.interestRate+1,form.tenureYears):0;
  return {form,acquisitionCost,usesTrueCost:form.trueAcquisitionCost>0,grossAnnualRent,grossAnnualIncome,...op,grossRentalYield,grossYieldOnListing,netRentalYield,monthlyEMI,annualDebtService,annualCashFlow,monthlyCashFlow,acquisitionCostsPaidFromCash,cashInvested,cashOnCashReturn,breakEvenRent,targetRent,projection,estimatedSalePrice:hold.propertyValue,sellingCosts,outstandingLoanBalance:hold.loanBalance,netSaleProceeds,totalInvestmentGain,totalROI,annualizedReturn,cashFlowMargin,healthParts,healthScore,vacancyStressCashFlow:(vacancyStress.noi-annualDebtService)/12,interestStress:{rate:form.interestRate+1,emi:stressEMI,monthlyCashFlow:(op.noi-stressEMI*12)/12,cashOnCashReturn:cashInvested?(op.noi-stressEMI*12)/cashInvested*100:0}};
}

export function calculateRentalScenarios(form, adjustments) {
  return Object.fromEntries(Object.entries(adjustments).map(([name,a])=>[name,calculateRentalROI({...form,vacancyRate:a.vacancyRate,rentGrowthRate:a.rentGrowthRate,appreciationRate:a.appreciationRate,repairReserve:a.repairReserve})]));
}
