const Secs = 2000
const fixed1 = 1000000

let InflationState = {
  rate: fixed1,
  factor: fixed1,
  updatePeriod: Secs,
  factorLastUpdated: Date.now()
}
const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

function setInflationParameters(rate, updatePeriod) {
  getUpdatedInflationFactor()
  InflationState.rate = rate;
  InflationState.updatePeriod = updatePeriod;
}

function getUpdatedInflationFactor() {
  const currTime = Date.now()
  if ( currTime < InflationState.factorLastUpdated + InflationState.updatePeriod) {
    return {currentInflationFactor: InflationState.factor, lastUpdated: InflationState.factorLastUpdated};
  }
  console.log((fixed1 + (InflationState.rate/100)))
  const timesToApplyInflation = ((Date.now() - InflationState.factorLastUpdated)/InflationState.updatePeriod).toFixed(0)
  const currentInflationFactor = (InflationState.factor * (((fixed1 + (InflationState.rate/100)) / (fixed1)) ** timesToApplyInflation)).toFixed(0) * 1
  const lastUpdated = InflationState.factorLastUpdated + InflationState.updatePeriod * timesToApplyInflation
  InflationState.factor = currentInflationFactor
  InflationState.factorLastUpdated = lastUpdated
  return { currentInflationFactor, lastUpdated }
}

console.log("Initial \n", getUpdatedInflationFactor())
setInflationParameters((3 / 2).toFixed(6)*1000000, 2000)
delay(2000).then(() => { console.log(getUpdatedInflationFactor())}).then(() => {
  setInflationParameters((1).toFixed(6)*1000000, 2000)
  console.log("Final \n", getUpdatedInflationFactor())
})

