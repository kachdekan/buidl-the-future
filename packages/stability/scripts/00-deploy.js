module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const { utils } = require('ethers')

  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  const lockedAmount = utils.parseEther("1");

  await deploy('StableTokenV1', {
    from: deployer,
    args: [true],
    //value: lockedAmount,
    log: true,
  })
}

module.exports.tags = ['StableTokenV1']
