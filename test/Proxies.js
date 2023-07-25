const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert } = require("chai");

describe("Lock", function () {
  async function deployFixture() {
    const Proxies = await ethers.getContractFactory("Proxies");
    const proxies = await Proxies.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt("Logic1", proxies);
    const proxyAsLogic2 = await ethers.getContractAt("Logic2", proxies);

    return { proxies, logic1, logic2, proxyAsLogic1, proxyAsLogic2 };
  };

  async function lookupUint(address, slot) {
    const storage = await ethers.provider.getStorageAt(address, slot);
    return parseInt(storage, 16);
  }

  it("should change the value for Logic1", async function () {
    const { proxies, proxyAsLogic1, logic1 } = await loadFixture(deployFixture);

    await proxies.changeImplementation(logic1);

    assert.equal(await logic1.x(), 0); // Change this line to use proxyAsLogic1

    await proxyAsLogic1.changeX(52); // Add await here

    assert.equal(await logic1.x(), 52); // Change this line to use proxyAsLogic1
  });

  it('should upgrade logic2', async function () {
    const { proxies, proxyAsLogic1, proxyAsLogic2, logic2, logic1 } = await loadFixture(deployFixture);
    await proxies.changeImplementation(logic1);
    assert.equal(await logic1.x(), 0);
    await proxyAsLogic1.changeX(45);
    assert.equal(await logic1.x(), 45);

    await proxies.changeImplementation(logic2);
    assert.equal(await logic2.x(), 0);
    await proxyAsLogic2.changeX(25);
    await proxyAsLogic2.tripleX();
    assert.equal(await logic2.x(), 75);
  })

});
