import { useMutation } from "@tanstack/react-query";
import { CreatePaymentUrlReq, paymentApi } from "@my-project/api";

export function useCreatePaymentUrl() {
  return useMutation({
    mutationFn: (data: CreatePaymentUrlReq) => paymentApi.createUrl(data),
  });
}
