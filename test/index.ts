import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    this.timeout(60_000); // set 60 second timeout

    // deploy test
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();
    expect(await greeter.greet()).to.equal('Hello, world!');

    // setter test
    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');
    await setGreetingTx.wait();
    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});
