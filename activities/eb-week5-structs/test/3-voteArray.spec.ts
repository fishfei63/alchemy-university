import { JsonRpcSigner } from "@ethersproject/providers";
import { assert } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const CHOICES = {
  YES: 0,
  NO: 1,
};

describe("3. Contract3 - Vote Array", function () {
  let contract: Contract;
  let accounts: { address: string; signer: JsonRpcSigner }[];

  before(async () => {
    const Contract = await ethers.getContractFactory("Contract3");
    contract = await Contract.deploy();
    await contract.deployed();

    accounts = (await ethers.provider.listAccounts()).map((address) => ({
      address,
      signer: ethers.provider.getSigner(address),
    }));
  });

  describe("after voting yes", () => {
    before(async () => {
      await contract.connect(accounts[0].signer).createVote(CHOICES.YES);
    });

    it("should store a vote", async () => {
      const vote = await contract.votes(0);
      assert.equal(vote.choice, CHOICES.YES);
      assert.equal(vote.voter, accounts[0].address);
    });
  });

  describe("after voting no", () => {
    before(async () => {
      await contract.connect(accounts[1].signer).createVote(CHOICES.NO);
    });

    it("should store a vote", async () => {
      const vote = await contract.votes(1);
      assert.equal(vote.choice, CHOICES.NO);
      assert.equal(vote.voter, accounts[1].address);
    });
  });
});
