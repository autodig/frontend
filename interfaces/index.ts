// Contact Address interface
interface ContactAddress {
  line_1: string;
  line_2: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  country: string;
}

// FEC Personal Data interface
interface FECPersonalData {
  id: number;
  name: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  employer: string | null;
  occupation: string | null;
  unq_identifier: string;
}

// Contact details interface
// interface Contact {
//   id: string;
//   display_type: string;
//   title: string;
//   first_name: string;
//   middle_name: string;
//   last_name: string;
//   suffix: string;
//   salutation: string;
//   employer: string;
//   occupation: string;
//   van_id: string;
//   origin_code: string;
//   created_at: string;
//   updated_at: string;
//   emails__address__is_primary: string;
//   phones__number__is_primary: string;
//   addresses__line_1__is_primary: string;
//   addresses__line_2__is_primary: string;
//   addresses__city__is_primary: string;
//   addresses__state__is_primary: string;
//   addresses__zip__is_primary: string;
//   addresses__county__is_primary: string;
//   addresses__country__is_primary: string;
// }

// Transaction record interface
interface CallRecord {
  id: string;
  transacted_at: string;
  amount: string;
  display_source_name: string;
  display_wallet: string;
  frequency: string;
  account_source__name: string;
  form__name: string;
  external_form: string;
  designation: string;
  refcode: string;
  batch: string;
  source_code: string;
  member_code: string;
  reference_codes: string;
  referrer__full_name: string;
  notes: string;
  created_at: string;
  source_status: string;
  task_list__name: string;
  pledge__summary_func: string;
  soft_credits__summary_func: string;
  first_name: string;
  last_name: string;
  line_1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  text_message_opt_status: string;
  employer: string;
  occupation: string;
  associated_first_name: string;
  associated_last_name: string;
  employer_line_1: string;
  employer_city: string;
  employer_state: string;
  employer_zip: string;
  employer_country: string;
  contact__id: string;
  //   contact: Contact;
  display_type: string;
  title: string;
  middle_name: string;
  suffix: string;
  salutation: string;
  van_id: string;
  origin_code: string;
  updated_at: string;
  emails__address__is_primary: string;
  phones__number__is_primary: string;
  addresses__line_1__is_primary: string;
  addresses__line_2__is_primary: string;
  addresses__city__is_primary: string;
  addresses__state__is_primary: string;
  addresses__zip__is_primary: string;
  addresses__county__is_primary: string;
  addresses__country__is_primary: string;
}

// API Response interface
interface ApiResponse {
  success: boolean;
  data: CallRecord[];
}

export type { ContactAddress, CallRecord, ApiResponse, FECPersonalData };
