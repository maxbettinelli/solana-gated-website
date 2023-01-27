import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
    useClaimNFT,
    useLogin,
    useProgram,
    useLogout,
    useUser,
    useDropUnclaimedSupply,
    useNFTs,
 } from '@thirdweb-dev/react/solana';
import { wallet } from "./_app";
import { useRouter } from 'next/router';
import { NFT } from '@thirdweb-dev/sdk/dist/declarations/src';
import Link from 'next/link';
import Image from 'next/image';

function LoginPage() {
    const [usersNft, setUsersNft] = useState<NFT | undefined>();
    const login = useLogin();
    const logout = useLogout();
    const router = useRouter();
    const { user } = useUser();
    const { publicKey, connect, select } = useWallet();

    const { program } = useProgram(
        process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
        "nft-drop"
    )

    const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
    const { data: nfts, isLoading } = useNFTs(program);
    const { mutateAsync: claim } = useClaimNFT(program);

    useEffect(() => {
        if (!publicKey) {
            select(wallet.name);
            connect();
        }
    }, [publicKey, wallet]);

    useEffect(() => {
        if(!user || !nfts) return;

        const usersNft = nfts.find((nft) => nft.owner === user?.address);

        if (usersNft) {
            setUsersNft(usersNft);
        }
    }, [nfts, user]);

    const handleLogin = async () => {
        await login();
        router.replace("/");
    };

    const handlePurchase = async () => {
        await claim({
            amount: 1,
        });
        router.replace("/");
    }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center text-center bg-red-900'>
        <div className='absolute top-56 left-0 w-full h-1/4 bg-blue-900 -skew-y-6 z-10 overflow-hidden shadow-xl'/>

            <Image 
                className='mt-5 z-30 shadow-2xl mb-10 rounded-full'
                src="/dalle-column.png"
                alt='logo'
                width={400}
                height={400}
            />

            <main className='z-30 text-white'>
                <h1 className='text-4xl font-bold uppercase'>
                    Welcome to the <span className='text-blue-900'>site</span>
                </h1>

            {!user && (
                <div>
                    <button
                        onClick={handleLogin}
                        className='text-2xl font-bold mb-5 bg-gray-500 text-white py-4 px-10 border-2 border-blue-500 animate-pulse rounded-md transition duration-200 mt-5'
                    >
                        Login / Connect Wallet
                    </button>
                </div>
            )
            }

            {user && (
                <div>
                    <p className='text-lg font-bold text-blue-500 mb-10'>
                        Welcome {user.address.slice(0,5)}...{user.address.slice(-5)}
                    </p>

                    {isLoading && (
                        <div className='text-2xl font-bold mb-5 bg-red-900 text-white py-4 px-10 border-2 border-red-900 animate-pulse rounded-md transition duration-200'>
                            Hold on here, we're scanning for your web pass...
                        </div>
                    )
                    }

                    {usersNft && (
                        <Link
                            href="/"
                            className='text-2xl font-bold mb-5 bg-red-900 text-white py-4 px-10 border-2 border-red-900 animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-red-900 mt-5 uppercase'
                        >
                            Access Granted 🚀 
                        </Link>
                    )                    
                    }

                    {usersNft &&
                        !isLoading &&
                        (unclaimedSupply && unclaimedSupply > 0 ? (
                            <button
                                onClick={handlePurchase}
                                className='bg-blue-900 text-white py-4 px-10 border-2 border-red-900 rounded-md hover:bg-white hover:text-red-900 mt-5 uppercase font-bold transition-duration-200'
                            >
                                Buy a Site pass
                            </button>
                        ) : (
                            <p className='text-2xl font-bold mb-5 bg-red-900 text-white py-4 px-10 border-2 border-orange-900 rounded-md uppercase transition duration-200'>
                                Sorry, we're out! Secondary has some...
                            </p>
                        ))}
                </div>
            )}
            {user && (
                <button
                    onClick={logout}
                    className='bg-white text-red-900 py-4 px-10 border-2 border-red-900 rounded-md hover:bg-red-900 hover:text-white mt-10 uppercase font-bold trasnition duration-200'>
                    logout
                </button>
            )
            }
            </main>


        </div>

  )
}

export default LoginPage