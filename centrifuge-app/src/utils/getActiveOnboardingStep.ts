import { OnboardingUser } from '../types'

const BASE_ENTITY_STEPS = {
  LINK_WALLET: 1,
  CHOOSE_INVESTOR_TYPE: 2,
  VERIFY_BUSINESS: 3,
  CONFIRM_OWNERS: 4,
  VERIFY_IDENTITY: 5,
  VERIFY_TAX_INFO: 6,
}

const ENTITY_US_STEPS = {
  ...BASE_ENTITY_STEPS,
  VERIFY_ACCREDITATION: 7,
  SIGN_AGREEMENT: 8,
  COMPLETE: 9,
}

const ENTITY_NON_US_STEPS = {
  ...BASE_ENTITY_STEPS,
  SIGN_AGREEMENT: 7,
  COMPLETE: 8,
}

const BASE_INDIVIDUAL_STEPS = {
  LINK_WALLET: 1,
  CHOOSE_INVESTOR_TYPE: 2,
  VERIFY_IDENTITY: 3,
  VERIFY_TAX_INFO: 4,
}

const INDIVIDUAL_US_STEPS = {
  ...BASE_INDIVIDUAL_STEPS,
  VERIFY_ACCREDITATION: 5,
  SIGN_AGREEMENT: 6,
  COMPLETE: 7,
}

const INDIVIDUAL_NON_US_STEPS = {
  ...BASE_INDIVIDUAL_STEPS,
  VERIFY_TAX_INFO: 4,
  SIGN_AGREEMENT: 5,
  COMPLETE: 6,
}

export const getActiveOnboardingStep = (
  onboardingUser: OnboardingUser,
  isPendingManualKybReview: boolean,
  poolId?: string,
  trancheId?: string
) => {
  // user does not exist
  if (!onboardingUser) return 2

  const { investorType, countryOfCitizenship } = onboardingUser
  const { verifyIdentity, verifyTaxInfo, verifyAccreditation } = onboardingUser.globalSteps

  const hasSignedAgreement = !!(
    poolId &&
    trancheId &&
    onboardingUser.poolSteps?.[poolId]?.[trancheId]?.signAgreement?.completed
  )

  if (investorType === 'entity') {
    const { jurisdictionCode } = onboardingUser
    const { confirmOwners, verifyBusiness } = onboardingUser.globalSteps

    if (jurisdictionCode.startsWith('us')) {
      if (hasSignedAgreement) return ENTITY_US_STEPS.COMPLETE
      if (verifyAccreditation.completed) return ENTITY_US_STEPS.SIGN_AGREEMENT
      if (verifyTaxInfo.completed) return ENTITY_US_STEPS.VERIFY_ACCREDITATION
    } else {
      if (hasSignedAgreement) return ENTITY_NON_US_STEPS.COMPLETE
      if (verifyTaxInfo.completed) return ENTITY_NON_US_STEPS.SIGN_AGREEMENT
    }

    if (verifyIdentity.completed) return BASE_ENTITY_STEPS.VERIFY_TAX_INFO
    if (confirmOwners.completed) return BASE_ENTITY_STEPS.VERIFY_IDENTITY
    if (verifyBusiness.completed || isPendingManualKybReview) return BASE_ENTITY_STEPS.CONFIRM_OWNERS

    return BASE_ENTITY_STEPS.VERIFY_BUSINESS
  }

  if (investorType === 'individual' && countryOfCitizenship) {
    if (countryOfCitizenship === 'us') {
      if (hasSignedAgreement) return INDIVIDUAL_US_STEPS.COMPLETE
      if (verifyAccreditation.completed) return INDIVIDUAL_US_STEPS.SIGN_AGREEMENT
      if (verifyTaxInfo.completed) return INDIVIDUAL_US_STEPS.VERIFY_ACCREDITATION
      if (verifyIdentity.completed) return BASE_INDIVIDUAL_STEPS.VERIFY_TAX_INFO
    } else {
      if (hasSignedAgreement) return INDIVIDUAL_NON_US_STEPS.COMPLETE
      if (verifyTaxInfo.completed) return INDIVIDUAL_NON_US_STEPS.SIGN_AGREEMENT
      if (verifyIdentity.completed) return BASE_INDIVIDUAL_STEPS.VERIFY_TAX_INFO
    }

    return BASE_INDIVIDUAL_STEPS.VERIFY_IDENTITY
  }

  return 1
}
