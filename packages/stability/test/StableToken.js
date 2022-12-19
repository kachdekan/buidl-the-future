const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, artifacts, } = require('hardhat')
const { toFixed } = require("../utils/fixidity")
const { expect } = require('chai')

describe('StableToken', function (){
  const fixedRate = ethers.utils.parseUnits((1).toFixed(5).toString(), 5) //1%
  const weekInSecs = 60 * 60 * 24 * 7
  const amountToMint = 10
  async function deployStableTokenFixture(){
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]
    const stableToken = await ethers.getContractFactory("StableTokenV1");
    const Token = await stableToken.deploy(true);
    await Token.deployed()
    const response = await Token.initialize(
      'XDC Shilling',
      'Xsh',
      6,
      fixedRate,
      weekInSecs,
      [],
      []
    )
    initializationTime = (await ethers.provider.getBlock(response.blockNumber)).timestamp
    return {Token, addr1, addr2, initializationTime}
  }

  describe('#initialize()', function(){
    it('should have set a name', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      const name = await Token.name()
      expect(name).to.equal('XDC Shilling')
    })

    it('should have set a symbol', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      const symbol = await Token.symbol()
      expect(symbol).to.equal('Xsh')
    })

    it('should have set the owner', async () => {
      const { Token, addr1 } = await loadFixture(deployStableTokenFixture);
      const owner = await Token.owner()
      expect(owner).to.equal(addr1.address)
    })

    it('should have set decimals', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      const decimals = await Token.decimals()
      expect(decimals).to.equal(6)
    })

    it('should have set the inflation rate parameters', async () => {
      const { Token, initializationTime } = await loadFixture(deployStableTokenFixture);
      
      const [
        rate,
        factor,
        updatePeriod,
        factorLastUpdated,
      ] = await Token.getInflationParameters()
      expect(rate.eq(fixedRate)).to.be.true
      expect(factor.eq(fixedRate)).to.be.true
      expect(updatePeriod).to.equal(weekInSecs)
      expect(factorLastUpdated).to.equal(initializationTime)
    })

    it('should not be callable again', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      await expect(
        Token.initialize(
          'XDC Shilling',
          'Xsh',
          6,
          fixedRate,
          weekInSecs,
          [],
          []
        )
      ).to.be.reverted
    })
  })

  describe('#mint()', function(){
    it('should allow the owner to mint #Temporary', async () => {
      const { Token, addr1 } = await loadFixture(deployStableTokenFixture);
      await Token.mint(addr1.address, amountToMint)
      const balance = (await Token.balanceOf(addr1.address)).toNumber()
      expect(balance).to.equal(amountToMint)
      const supply = (await Token.totalSupply()).toNumber()
      expect(supply).to.equal(amountToMint)
    })
    //Add allow validators to mint
    //Add allow exchange contract to mint
    it('should allow minting 0 value', async () => {
      const { Token, addr1 } = await loadFixture(deployStableTokenFixture);
      await Token.mint(addr1.address, 0)
      const balance = (await Token.balanceOf(addr1.address)).toNumber()
      expect(balance).to.equal(0)
      const supply = (await Token.totalSupply()).toNumber()
      expect(supply).to.equal(0)
    })

    it('should not allow anyone else to mint', async () => {
      const { Token, addr2 } = await loadFixture(deployStableTokenFixture);
      await expect(Token.connect(addr2).mint(addr2.address, amountToMint)).to.be.reverted
    })
  })

  describe('#setInflationParameters()', function(){
    const inflationRate = ethers.utils.parseUnits((15 / 7).toFixed(5).toString(), 5)
    it('should update parameters', async () => {
      const { Token, initializationTime } = await loadFixture(deployStableTokenFixture);
      const newUpdatePeriod = weekInSecs + 5
      await Token.setInflationParameters(inflationRate, newUpdatePeriod)
      const [rate, , updatePeriod, lastUpdated] = await Token.getInflationParameters()
      expect(rate.eq(inflationRate)).to.be.true
      expect(updatePeriod.toNumber()).to.equal(newUpdatePeriod)
      expect(lastUpdated.toNumber()).to.equal(initializationTime)
    })
    
    it('should emit an InflationParametersUpdated event', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      const newUpdatePeriod = weekInSecs + 5 
      const response = await Token.setInflationParameters(inflationRate, newUpdatePeriod)
      const latestBlock = await ethers.provider.getBlock('latest')
      await expect(response).to.emit(Token, "InflationParametersUpdated").withArgs(
        inflationRate,
        newUpdatePeriod,
        latestBlock.timestamp,
      );
    })
    
    it('updates inflationFactor when out of date', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      //Rate is percent (not 1 + rate)
      const initialRate = ethers.utils.parseUnits((50).toFixed(5).toString(), 5) //50% infalation?!
      const expectedFactor = ethers.utils.parseUnits((3/2).toFixed(5).toString(), 5)
      const newRate = ethers.utils.parseUnits((10).toString(), 5) //10% infalation
      await Token.setInflationParameters(initialRate, weekInSecs)
      await time.increase(weekInSecs)
      const response = await Token.setInflationParameters(newRate, weekInSecs)
      const [rate, factor, , lastUpdated] = await Token.getInflationParameters()
      await expect(response).to.emit(Token, "InflationFactorUpdated").withArgs(
        factor,
        lastUpdated
      )  
      expect(rate).to.equal(newRate)
      expect(factor).to.equal(expectedFactor)
      expect(lastUpdated).to.exist
    })
    
    it('should revert when a zero rate is provided', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      const rate = ethers.utils.parseUnits((0).toFixed(5).toString(), 5) 
      await expect(Token.setInflationParameters(rate, weekInSecs)).to.be.reverted
    })
  })

  describe('#valueToUnits()', () => {
    let thisToken;

    beforeEach(async () => {
      const { Token } = await loadFixture(deployStableTokenFixture)
      thisToken = Token
      await Token.setInflationParameters(ethers.utils.parseUnits((0.5).toFixed(5).toString(), 5), weekInSecs)
      await time.increase(weekInSecs)
    })

    it('value 995 should correspond to roughly 1000 units after 0.5%(.005) depreciation', async () => {
      const response = await thisToken.setInflationParameters(fixedRate, weekInSecs)
      await expect(response).to.emit(thisToken, "InflationFactorUpdated")
      const units = (await thisToken.valueToUnits(995)).toNumber() //value in ether
      expect(units).to.equal(999) // roundoff err
    })

    it('value 990 should correspond to roughly 1000 units after 0.5%(.005) depreciation twice', async () => {
      await time.increase(weekInSecs)
      await thisToken.setInflationParameters(fixedRate, weekInSecs)
      const units = (await thisToken.valueToUnits(990)).toNumber() //value in ether
      expect(units).to.equal(999) // roundoff err
    })
  })
})