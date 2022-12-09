const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, artifacts } = require('hardhat')
const { expect } = require('chai')

//const StableToken = artifacts.readArtifact('StableToken')

describe('StableToken', function (){
  async function deployStableTokenFixture(){
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]
    const stableToken = await ethers.getContractFactory("StableToken");
    const Token = await stableToken.deploy(true);
    await Token.deployed();

    const response = await Token.initialize(
      'XDC Shilling',
      'Xsh',
      6
    )
    //console.log( response.receipt.blockNumber)
    return {Token, addr1, addr2}
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

    it('should not be callable again', async () => {
      const { Token } = await loadFixture(deployStableTokenFixture);
      await expect(
        Token.initialize(
          'XDC Shilling',
          'Xsh',
          6,
        )
      ).to.be.reverted
    })

  })
})