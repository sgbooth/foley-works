export type OdpMimeType = "PDF" | "XML" | "MS_WORD" | "PNG";
export type OdpDirection = "INTERNAL" | "OUTGOING" | "INCOMING";
export type PatentRepoKeys = "applicationId" | "publicationId" | "patentId";

export type PatentFileWrapperResponse = {
  count?: number;
  patentFileWrapperDataBag?: PatentFileWrapperData[];
};

export type PatentFileWrapperData = {
  applicationNumberText?: string;
  applicationMetaData?: ApplicationMetaData;
  correspondenceAddressBag?: CorrespondenceAddress[];
  assignmentBag?: Assignment[];
  recordAttorney?: RecordAttorney;
  foreignPriorityBag?: ForeignPriority[];
  parentContinuityBag?: ParentContinuity[];
  childContinuityBag?: ChildContinuity[];
  patentTermAdjustmentData?: PatentTermAdjustmentData;
  eventDataBag?: EventData[];
  pgpubDocumentMetaData?: FileHistoryEventMetaData;
  grantDocumentMetaData?: FileHistoryEventMetaData;
  lastIngestionDateTime?: string;
};

export type PatentApplicationData = PatentFileWrapperData & {
  applicationNumberText: string;
};

type ApplicationMetaData = {
  nationalStageIndicator?: boolean;
  entityStatusData?: EntityStatusData;
  publicationDateBag?: string[];
  publicationSequenceNumberBag?: string[];
  publicationCategoryBag?: string[];

  docketNumber?: string;
  firstInventorToFileIndicator?: string;
  firstApplicantName?: string;
  firstInventorName?: string;

  applicationConfirmationNumber?: number;
  applicationStatusDate?: string;
  applicationStatusDescriptionText?: string;

  filingDate?: string;
  effectiveFilingDate?: string;
  grantDate?: string;

  groupArtUnitNumber?: string;

  applicationTypeCode?: string;
  applicationTypeLabelName?: string;
  applicationTypeCategory?: string;

  inventionTitle?: string;
  patentNumber?: string;

  applicationStatusCode?: number;

  earliestPublicationNumber?: string;
  earliestPublicationDate?: string;

  pctPublicationNumber?: string;
  pctPublicationDate?: string;

  internationalRegistrationPublicationDate?: string;
  internationalRegistrationNumber?: string;

  examinerNameText?: string;

  class?: string;
  subclass?: string;
  uspcSymbolText?: string;

  customerNumber?: number;

  cpcClassificationBag?: string[];

  applicantBag?: Applicant[];
  inventorBag?: Inventor[];
};

type EntityStatusData = {
  smallEntityStatusIndicator?: boolean;
  businessEntityStatusCategory?: string;
};

export type Applicant = {
  applicantNameText?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  countryCode?: string;
  correspondenceAddressBag?: PersonCorrespondenceAddress[];
};

type Inventor = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  preferredName?: string;
  countryCode?: string;
  inventorNameText?: string;
  correspondenceAddressBag?: PersonCorrespondenceAddress[];
};

type PersonCorrespondenceAddress = {
  nameLineOneText?: string;
  nameLineTwoText?: string;
  geographicRegionName?: string;
  geographicRegionCode?: string;
  cityName?: string;
  countryCode?: string;
  countryName?: string;
  postalAddressCategory?: string;
};

type CorrespondenceAddress = {
  nameLineOneText?: string;
  nameLineTwoText?: string;
  addressLineOneText?: string;
  addressLineTwoText?: string;
  geographicRegionName?: string;
  geographicRegionCode?: string;
  postalCode?: string;
  cityName?: string;
  countryCode?: string;
  countryName?: string;
  postalAddressCategory?: string;
};

type Assignment = {
  reelNumber?: number;
  frameNumber?: number;
  reelAndFrameNumber?: string;
  pageTotalQuantity?: number;
  assignmentDocumentLocationURI?: string;
  assignmentReceivedDate?: string;
  assignmentRecordedDate?: string;
  assignmentMailedDate?: string;
  conveyanceText?: string;

  assignorBag?: Assignor[];
  assigneeBag?: Assignee[];
  correspondenceAddress?: AssignmentCorrespondenceAddress[];
};

type Assignor = {
  assignorName?: string;
  executionDate?: string;
};

type Assignee = {
  assigneeNameText?: string;
  assigneeAddress?: AssigneeAddress;
};

type AssigneeAddress = {
  addressLineOneText?: string;
  addressLineTwoText?: string;
  cityName?: string;
  geographicRegionName?: string;
  geographicRegionCode?: string;
  countryName?: string;
  postalCode?: string;
};

type AssignmentCorrespondenceAddress = {
  correspondentNameText?: string;
  addressLineOneText?: string;
  addressLineTwoText?: string;
  addressLineThreeText?: string;
  addressLineFourText?: string;
};

type RecordAttorney = {
  customerNumberCorrespondenceData?: CustomerNumberCorrespondenceData[];
  powerOfAttorneyBag?: PowerOfAttorney[];
  attorneyBag?: Attorney[];
};

type CustomerNumberCorrespondenceData = {
  patronIdentifier?: number;
  organizationStandardName?: string;
  powerOfAttorneyAddressBag?: PowerOfAttorneyAddress[];
  telecommunicationAddressBag?: TelecommunicationAddress[];
};

type PowerOfAttorneyAddress = {
  nameLineOneText?: string;
  addressLineOneText?: string;
  addressLineTwoText?: string;
  geographicRegionName?: string;
  geographicRegionCode?: string;
  postalCode?: string;
  cityName?: string;
  countryCode?: string;
  countryName?: string;
};

type TelecommunicationAddress = {
  telecommunicationNumber?: string;
  extensionNumber?: string;
  telecomTypeCode?: string;
};

type PowerOfAttorney = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  preferredName?: string;
  countryCode?: string;
  registrationNumber?: string;
  activeIndicator?: string;
  registeredPractitionerCategory?: string;
  attorneyAddressBag?: AttorneyAddress[];
  telecommunicationAddressBag?: TelecommunicationAddress[];
};

type Attorney = {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  registrationNumber?: string;
  activeIndicator?: string;
  registeredPractitionerCategory?: string;
  attorneyAddressBag?: AttorneyAddress[];
  telecommunicationAddressBag?: TelecommunicationAddress[];
};

type AttorneyAddress = {
  nameLineOneText?: string;
  nameLineTwoText?: string;
  addressLineOneText?: string;
  addressLineTwoText?: string;
  geographicRegionName?: string;
  geographicRegionCode?: string;
  postalCode?: string;
  cityName?: string;
  countryCode?: string;
  countryName?: string;
};

type ForeignPriority = {
  ipOfficeName?: string;
  filingDate?: string;
  applicationNumberText?: string;
};

type ParentContinuity = {
  firstInventorToFileIndicator?: boolean;
  parentApplicationStatusCode?: number;
  parentPatentNumber?: string;
  parentApplicationStatusDescriptionText?: string;
  parentApplicationFilingDate?: string;
  parentApplicationNumberText?: string;
  childApplicationNumberText?: string;
  claimParentageTypeCode?: string;
  claimParentageTypeCodeDescriptionText?: string;
};

type ChildContinuity = {
  childApplicationStatusCode?: number;
  parentApplicationNumberText?: string;
  childApplicationNumberText?: string;
  childApplicationStatusDescriptionText?: string;
  childApplicationFilingDate?: string;
  firstInventorToFileIndicator?: boolean;
  childPatentNumber?: string;
  claimParentageTypeCode?: string;
  claimParentageTypeCodeDescriptionText?: string;
};

type PatentTermAdjustmentData = {
  aDelayQuantity?: number;
  adjustmentTotalQuantity?: number;
  applicantDayDelayQuantity?: number;
  bDelayQuantity?: number;
  cDelayQuantity?: number;
  nonOverlappingDayQuantity?: number;
  overlappingDayQuantity?: number;
  patentTermAdjustmentHistoryDataBag?: PatentTermAdjustmentHistory[];
};

type PatentTermAdjustmentHistory = {
  eventDate?: string;
  applicantDayDelayQuantity?: number;
  eventDescriptionText?: string;
  eventSequenceNumber?: number;
  ipOfficeDayDelayQuantity?: number;
  originatingEventSequenceNumber?: number;
  ptaPTECode?: string;
};

export interface FileHistoryBag {
  documentBag: FileHistoryEvent[];
}

export interface FileHistoryEvent {
  applicationNumberText: string;
  officialDate: string;
  documentIdentifier: string;
  documentCode: string;
  documentCodeDescriptionText: string;
  directionCategory: OdpDirection;
  downloadOptionBag: DownloadOption[];
}

export interface DownloadOption {
  mimeTypeIdentifier: OdpMimeType;
  downloadUrl: string;
  pageTotalQuantity?: number;
}

export type EventData = {
  eventCode?: string;
  eventDescriptionText?: string;
  eventDate?: string;
};

export type FileHistoryEventMetaData = {
  zipFileName?: string;
  productIdentifier?: string;
  fileLocationURI?: string;
  fileCreateDateTime?: string;
  xmlFileName?: string;
};
