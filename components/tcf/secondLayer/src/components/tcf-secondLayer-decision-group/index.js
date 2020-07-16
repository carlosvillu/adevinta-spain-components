import React from 'react'
import PropTypes from 'prop-types'

import Button from '@s-ui/react-atom-button'

import TcfSecondLayerUserDecision from '../tcf-secondLayer-user-decision'
import TcfSecondLayerVendorsUserDecision from '../tcf-secondLayer-vendors-user-decision'
export function TcfSecondLayerDecisionGroup({
  name,
  i18n,
  baseClass,
  descriptions,
  state,
  filteredIds,
  hasConsent,
  onConsentChange,
  onAcceptAll,
  onRejectAll,
  vendorList,
  expandedContent,
  isVendorLayer
}) {
  let descriptionKeys =
    descriptions && Object.keys(descriptions).map(key => parseInt(key))
  if (filteredIds) {
    descriptionKeys = descriptionKeys.filter(key => filteredIds.includes(key))
  }
  if (!descriptionKeys?.length) {
    return null
  }
  const ButtonAll = React.memo(() => (
    <div className={`${baseClass}Header-buttons`}>
      <Button size="small" design="outline" onClick={onRejectAll}>
        {i18n.DISABLE_BUTTON}
      </Button>
      <Button size="small" onClick={onAcceptAll}>
        {i18n.ENABLE_BUTTON}
      </Button>
    </div>
  ))

  return (
    <>
      <div className={`${baseClass}Header`}>
        <h5 className={`${baseClass}Header-title`}>{name}</h5>
        {hasConsent ? <ButtonAll /> : null}
      </div>
      {/* sui-TcfSecondLayer-group-item- */}
      {/* sui-TcfSecondLayer-group-item--vendors */}
      {descriptionKeys.map((key, index) => {
        const consentValue = state?.consents
          ? state.consents[key]
          : state?.[key]
        return isVendorLayer ? (
          <TcfSecondLayerUserDecision
            key={`${key}-${index}`}
            baseClass={`${baseClass}`}
            info={descriptions[key]}
            consentValue={consentValue}
            hasConsent={hasConsent}
            i18n={i18n}
            vendorList={vendorList}
            onConsentChange={value => onConsentChange({index: key, value})}
            expandedContent={expandedContent}
          />
        ) : (
          <TcfSecondLayerVendorsUserDecision
            key={`${key}-${index}`}
            baseClass={`${baseClass}`}
            info={descriptions[key]}
            consentValue={consentValue}
            hasConsent={hasConsent}
            i18n={i18n}
            vendorList={vendorList}
            onConsentChange={value => onConsentChange({index: key, value})}
            expandedContent={expandedContent}
          />
        )
      })}
    </>
  )
}

TcfSecondLayerDecisionGroup.propTypes = {
  name: PropTypes.string,
  i18n: PropTypes.object,
  baseClass: PropTypes.string,
  descriptions: PropTypes.object,
  state: PropTypes.object,
  filteredIds: PropTypes.arrayOf(PropTypes.number),
  hasConsent: PropTypes.bool,
  isVendorLayer: PropTypes.bool,
  onConsentChange: PropTypes.func,
  onAcceptAll: PropTypes.func,
  onRejectAll: PropTypes.func,
  vendorList: PropTypes.object,
  expandedContent: PropTypes.func
}

export default React.memo(TcfSecondLayerDecisionGroup)
