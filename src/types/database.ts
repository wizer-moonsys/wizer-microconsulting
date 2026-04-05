// Wizer Microconsulting — Database Types
// These mirror the Supabase schema exactly

export type UserRole = 'super_admin' | 'org_admin' | 'client' | 'participant'
export type ActivationStatus = 'draft' | 'submitted' | 'accepted' | 'funded' | 'active' | 'complete' | 'cancelled'
export type QuestionType = 'yes_no' | 'open' | 'scale' | 'multiple_choice'
export type QuestionStatus = 'pending' | 'active' | 'complete'
export type CohortModel = 'same_panel' | 'min_per_question'
export type InvitationStatus = 'invited' | 'accepted' | 'declined' | 'completed'
export type PointsType = 'per_question' | 'completion_bonus'
export type PointsStatus = 'pending' | 'released'
export type OrgType = 'wizer' | 'partner' | 'client'

export interface Organization {
  id: string
  name: string
  type: OrgType
  is_indigenous_org: boolean
  abn?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id?: string
  role: UserRole
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  location?: string
  community?: string
  gender?: string
  age_range?: string
  bio?: string
  avatar_url?: string
  points_balance: number
  total_earned: number
  created_at: string
  updated_at: string
}

export interface Panel {
  id: string
  organization_id: string
  name: string
  description?: string
  member_count: number
  created_at: string
  updated_at: string
}

export interface Activation {
  id: string
  client_org_id: string
  assigned_org_id?: string
  title: string
  description?: string
  areas_of_interest?: string[]
  is_indigenous: boolean
  cohort_model: CohortModel
  min_participants: number
  max_participants: number
  question_count: number
  min_per_question?: number
  cadence_days: number
  status: ActivationStatus
  escrow_amount_cents: number
  client_contribution_cents: number
  org_contribution_cents: number
  per_participant_rate_cents: number
  completion_bonus_cents: number
  indigenous_review_window: boolean
  submitted_at?: string
  accepted_at?: string
  funded_at?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface ActivationQuestion {
  id: string
  activation_id: string
  question_number: number
  text: string
  type: QuestionType
  options_config?: Record<string, unknown>
  status: QuestionStatus
  responses_target?: number
  responses_count: number
  sent_at?: string
  completed_at?: string
  results_published_at?: string
  indigenous_hold_until?: string
  points_per_response_cents: number
  created_at: string
  updated_at: string
}

export interface QuestionResponse {
  id: string
  question_id: string
  participant_id: string
  activation_id: string
  response: Record<string, unknown>
  comment?: string
  submitted_at: string
}

export interface Invitation {
  id: string
  activation_id: string
  participant_id: string
  panel_id?: string
  status: InvitationStatus
  invited_at: string
  responded_at?: string
  completed_at?: string
}

export interface PointsLedgerEntry {
  id: string
  participant_id: string
  activation_id?: string
  question_id?: string
  amount_cents: number
  type: PointsType
  status: PointsStatus
  description?: string
  released_at?: string
  created_at: string
}
