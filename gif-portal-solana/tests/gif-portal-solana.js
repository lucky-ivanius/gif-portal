const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const transaction = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.GifPortalSolana;
  
  const baseAccount = anchor.web3.Keypair.generate();
  
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);
  
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString());

  await program.rpc.addGif("insert_a_giphy_link_here", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  console.log('👀 GIF List', account.gifList)
}

const main = async () => {
  try {
    await transaction();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();