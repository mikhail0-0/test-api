interface Lead {
  id?: number;
  name?: string;
  price?: number;
  responsible_user_id?: number;
  group_id?: number;
  status_id?: number;
  pipeline_id?: number;
  loss_reason_id?: number;
  source_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: number;
  updated_at?: number;
  closed_at?: number;
  closest_task_at?: number;
  is_deleted?: boolean;
  custom_fields_values?: [];
  score?: number;
  account_id?: number;
  _links?: {
      self?: {
          href?: string
      }
  };
}

interface LeadsResponse {
  _embedded?: {
    leads?: Lead[]
  }
}

interface PipelineStatus {
  id?: number;
  name?: string;
}

interface Pipeline {
  id?: number;
  _embedded?: {
    statuses?: PipelineStatus[];
  }
}

interface PipelinesResponse {
  _embedded?: {
    pipelines?: Lead[]
  }
}

interface User {
  id?: number;
  name?: string;
}

interface UsersResponse {
  _embedded?: {
    users?: User[]
  }
}

interface LeadResponse extends Lead {
  status: string;
  responsible_name: string;
}