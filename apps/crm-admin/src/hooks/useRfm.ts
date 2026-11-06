import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRfmSegmentsOverview,
  getRfmSegmentUsers,
  recalculateRfmNow,
  downloadRfmAudienceCsv,
  type SegmentSummaryDto,
  type PagedSegmentUsersRes,
} from "@my-project/api";

export const rfmKeys = {
  all: ["admin", "rfm"] as const,
  overview: () => [...rfmKeys.all, "overview"] as const,
  segmentUsers: (segmentKey: string, params?: { keyword?: string; page?: number; pageSize?: number }) =>
    [...rfmKeys.all, "segment-users", segmentKey, params] as const,
};

export function useRfmSegmentsOverview() {
  return useQuery<SegmentSummaryDto[]>({
    queryKey: rfmKeys.overview(),
    queryFn: getRfmSegmentsOverview,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRfmSegmentUsers(
  segmentKey?: string,
  params?: { keyword?: string; page?: number; pageSize?: number },
  options?: { enabled?: boolean }
) {
  return useQuery<PagedSegmentUsersRes>({
    queryKey: rfmKeys.segmentUsers(segmentKey || "", params),
    queryFn: () => getRfmSegmentUsers(segmentKey!, params),
    enabled: Boolean(segmentKey) && (options?.enabled ?? true),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
}

export function useRecalculateRfm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recalculateRfmNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rfmKeys.all });
    },
  });
}

export function useDownloadRfmAudienceCsv() {
  return useMutation({
    mutationFn: (segmentKey: string) => downloadRfmAudienceCsv(segmentKey),
  });
}

