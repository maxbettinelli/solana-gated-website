import { useLogout } from "@thirdweb-dev/react/solana"
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import { GetServerSideProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { getUser } from "../auth.config"
import { network } from "./_app"

export const GetServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user) 
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );
  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  if (!nft) 
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

    return {
      props: {}
    }

}

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1>
        You made it inside the NFT gated site
      </h1>
    </div>
  )
}

export default Home
