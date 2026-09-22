import { useMutation } from "@tanstack/react-query";
import { CreatePaymentUrlReq } from "./types";
import { paymentApi } from "./api";

export function useCreatePaymentUrl() {
  return useMutation({
    mutationFn: (data: CreatePaymentUrlReq) => paymentApi.createUrl(data),
  });
}
