import { axiosClient } from "@my-project/shared-utils";
import { CreatePaymentUrlReq, CreatePaymentUrlRes } from "./types";

export const paymentApi = {
  createUrl: (data: CreatePaymentUrlReq) => {
    return axiosClient
        .post<CreatePaymentUrlRes>("/api/v1/payment/url", data)
        .then((r) => r.data);
  },
};
