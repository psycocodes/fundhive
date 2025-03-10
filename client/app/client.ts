import {
    createThirdwebClient,
    getContract,
  } from "thirdweb";
  import { defineChain } from "thirdweb/chains";
  
  const client = createThirdwebClient({
    clientId: `${process.env.CLIENT_ID}`,
  });
  
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(43113),
    address: "0xe114a60EA0b3229083A15998b488F3dDBA55abC9",
  });
  export {contract};
  export default client;