export enum ProductStatus {
  Unassigned = 'Unassigned',
  InDesign = 'In design',
  ReadyForInternalQC = 'Ready for internal QC',
  RejectedByInternalQC = 'Rejected by internal QC',
  ReadyForMerchantsQC = 'Ready for Merchants QC',
  RejectedByMerchantsQC = 'Rejected by Merchants QC',
  ApprovedByMerchantsQC = 'Approved by Merchants QC',
  CalibrationDone = 'Calibration Done',
  SubmittedToRetina = 'Submitted to Retina',
  Excluded = 'Excluded',
  DesignDone = 'Design Done',
}

export const getProductStatus = (): ProductStatus[] => {
  return Object.values(ProductStatus)
}
