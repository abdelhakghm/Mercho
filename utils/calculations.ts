
import { ServiceOrder, DeliveryStatus, Product } from '../types';

export const calculateServiceMetrics = (
  quantity: number,
  purchaseCost: number,
  printingCost: number,
  sellingPrice: number
) => {
  const totalCost = purchaseCost + printingCost;
  const profit = sellingPrice - totalCost;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const unitCost = quantity > 0 ? purchaseCost / quantity : 0;

  return {
    totalCost,
    profit,
    margin,
    unitCost
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " DZD";
};

// Added calculateProductTotalCost function
export const calculateProductTotalCost = (product: Product): number => {
  let cost = product.baseCost;
  if (product.isPrinted && product.printingCostDetails) {
    const { ink, paper, machine, labor } = product.printingCostDetails;
    cost += (ink || 0) + (paper || 0) + (machine || 0) + (labor || 0);
  }
  return cost;
};

// Added calculateProfitMargin function
export const calculateProfitMargin = (sellingPrice: number, cost: number): number => {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - cost) / sellingPrice) * 100;
};

export const getFinancialSummary = (orders: ServiceOrder[], transactions: any[]) => {
  const collectedOrders = orders.filter(o => o.status === DeliveryStatus.COLLECTED);
  const pendingOrders = orders.filter(o => o.status !== DeliveryStatus.COLLECTED);

  const totalCollectedRevenue = collectedOrders.reduce((sum, o) => sum + o.totalSellingPrice, 0);
  const totalPendingCollection = pendingOrders.reduce((sum, o) => sum + o.totalSellingPrice, 0);
  
  const totalCosts = orders.reduce((sum, o) => sum + o.totalPurchaseCost + o.printingCost, 0);
  const totalProfit = orders.reduce((sum, o) => sum + o.profit, 0);
  
  const totalWithdrawals = transactions.reduce((sum, t) => sum + t.amount, 0);
  const netCashInTill = totalCollectedRevenue - totalWithdrawals;

  return {
    totalCollectedRevenue,
    totalPendingCollection,
    totalCosts,
    totalProfit,
    totalWithdrawals,
    netCashInTill
  };
};
