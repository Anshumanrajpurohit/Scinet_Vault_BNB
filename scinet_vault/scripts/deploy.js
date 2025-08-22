async function main() {
  const ResearchRegistry = await ethers.getContractFactory("ResearchRegistry");
  const researchRegistry = await ResearchRegistry.deploy();
  await researchRegistry.deployed();
  console.log("ResearchRegistry deployed to:", researchRegistry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
