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

    return { proxies, logic1, logic2 };
  }

  it("should change the value for Logic1", async function () {
    const { proxies, logic1 } = await loadFixture(deployFixture);

    await proxies.changeImplementation(logic1);

    assert.equal(await logic1.x(), 0);

    await proxies.changeX(52);

    assert.equal(await logic1.x(), 52);
  })

});
