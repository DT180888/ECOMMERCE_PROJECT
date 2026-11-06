import React from "react";
import { UserIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import type { OrderAddress } from "@my-project/api";

interface OrderCustomerCardProps {
  email?: string | null;
  shipTo?: OrderAddress | null;
  notes?: string | null;
}

export function OrderCustomerCard({ email, shipTo, notes }: OrderCustomerCardProps) {
  return (
    <section className="space-y-3">
      {/* ── Section Header (Pure Typography & Spacing) ── */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <UserIcon className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground" aria-hidden="true" />
          <h3 className="font-medium text-foreground text-xs uppercase tracking-[0.16em]">
            Khách hàng & Giao hàng
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {email ? "Đã đăng ký" : "Khách vãng lai"}
        </span>
      </div>

      {/* ── Customer & Shipping Details ── */}
      <div className="space-y-3 text-xs">
        {/* Account Email */}
        {email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <EnvelopeIcon className="w-3.5 h-3.5 stroke-[1.25] shrink-0 text-muted-foreground/80" />
            <span className="text-foreground font-mono text-xs truncate">{email}</span>
          </div>
        )}

        {/* Recipient Details */}
        {shipTo ? (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5 stroke-[1.25] shrink-0 text-muted-foreground/80" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-foreground font-medium text-xs">{shipTo.recipientName}</span>
                {shipTo.label && (
                  <span className="text-[9.5px] font-mono uppercase px-1 py-0.5 rounded-[1px] bg-surface text-muted-foreground">
                    {shipTo.label}
                  </span>
                )}
              </div>
            </div>

            {shipTo.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 stroke-[1.25] shrink-0 text-muted-foreground/80" />
                <span className="text-foreground font-mono tabular-nums text-xs">{shipTo.phone}</span>
              </div>
            )}

            {/* Structured Address Dossier */}
            <div className="pt-1">
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-1">
                <MapPinIcon className="w-3 h-3 stroke-[1.25]" />
                <span>Địa chỉ nhận hàng:</span>
              </div>
              <div className="text-muted-foreground leading-relaxed text-xs">
                <div className="text-foreground font-medium">{shipTo.line1}</div>
                {shipTo.line2 && <div>{shipTo.line2}</div>}
                <div>
                  {shipTo.city}
                  {shipTo.state ? `, ${shipTo.state}` : ""}
                  {shipTo.postalCode ? ` - ${shipTo.postalCode}` : ""}
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">{shipTo.country}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-xs italic">
            Không có thông tin địa chỉ giao hàng.
          </div>
        )}

        {/* Optional Order Notes */}
        {notes && (
          <div className="pt-2 space-y-1">
            <div className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
              <ChatBubbleBottomCenterTextIcon className="w-3 h-3 stroke-[1.25]" />
              <span>Ghi chú từ khách:</span>
            </div>
            <p className="text-xs text-foreground italic bg-surface/40 p-2.5 rounded-[2px]">
              "{notes}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
