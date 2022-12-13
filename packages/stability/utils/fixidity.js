const BigNumber = require('bignumber.js')

const digits = new BigNumber('24')
const fixed1 = new BigNumber('1000000000000000000000000')

module.exports = {
 toFixed: (n) => {
  return fixed1.times(n).integerValue(BigNumber.ROUND_FLOOR)
},

// Keeps the decimal portion
 fromFixed: (f) => {
  return f.div(fixed1)
},

// Returns an integer
 fixedToInt: (f) => {
  return f.idiv(fixed1)
},

 multiply: (a, b) => {
  return a.times(b).idiv(fixed1)
},

 divide: (a, b) => {
  return a.times(fixed1).idiv(b)
},

 reciprocal: (f) => {
  return divide(fixed1, f)
},

}

