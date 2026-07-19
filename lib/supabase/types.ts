export type OTHubRole = "member" | "therapist" | "admin";

export interface OTHubProfile {
  id: string;
  display_name: string | null;
  role: OTHubRole;
  license_no: string | null;
  org: string | null;
  therapist_requested_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}
