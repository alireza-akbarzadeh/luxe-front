import type { UtilsResponse } from '@/services/-admin-audit-logs-get.schemas';

/** Audit log row — mirrors backend dto.AuditLogResponse until OpenAPI exposes it. */
export interface DtoAuditLogResponse {
  id?: number;
  user_id?: number;
  user_email?: string;
  action?: string;
  resource?: string;
  resource_id?: string;
  path?: string;
  ip_address?: string;
  request_id?: string;
  created_at?: string;
}

export type GetAdminAuditLogs200 = UtilsResponse & {
  data?: {
    logs?: DtoAuditLogResponse[];
    total?: number;
    limit?: number;
    offset?: number;
  };
};
