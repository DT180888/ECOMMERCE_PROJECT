export interface CreatePaymentUrlReq {
  orderId: number;
  returnUrl: string;
}

export interface CreatePaymentUrlRes {
  paymentUrl: string; 
}