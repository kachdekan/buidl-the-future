const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, artifacts, } = require('hardhat')
const { expect } = require('chai')

describe('StableToken', function (){
  const fixedRate = ethers.BigNumber.from("1000000000000000000000000")
  const weekInSecs = 60 * 60 * 24 * 7
  const amountToMint = 10

  async function deployStableTokenFixture(){
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]
    const stableToken = await ethers.getContractFactory("StableToken");
    const Token = await stableToken.deploy(true);
    await Token.deployed()
    const response = await Token.initialize(
      'XDC Shilling',
      'Xsh',
      18,
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
      expect(decimals).to.equal(18)
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
          18,
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
})