'use client';

import Link from 'next/link';
import { Playfair_Display, Inter } from 'next/font/google';
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit';
import { useState, useEffect } from 'react';
import { isAddress } from 'viem';
import { useConnectWallet, useWallets, usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import { createPublicClient, http, formatEther } from 'viem';
import { optimism } from 'viem/chains';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const getWalletIcon = (walletClientType: string) => {
  switch (walletClientType.toLowerCase()) {
    case 'metamask':
      return '/wallet-icons/metamask.svg';
    case 'coinbase_wallet':
    case 'coinbasewallet':
      return '/wallet-icons/coinbase.svg';
    case 'walletconnect':
      return '/wallet-icons/walletconnect.svg';
    case 'embedded':
      return '/wallet-icons/privy.svg';
    case 'injected':
      return '/wallet-icons/metamask.svg';
    case 'safe':
      return '/wallet-icons/safe.svg';
    default:
      return '/wallet-icons/wallet.svg';
  }
};

// Initialize public clients for both networks
const optimismClient = createPublicClient({
  chain: {
    ...optimism,
    rpcUrls: {
      default: { http: ['https://mainnet.optimism.io'] },
      public: { http: ['https://mainnet.optimism.io'] },
    }
  },
  transport: http()
});

const unichainClient = createPublicClient({
  chain: {
    id: 130,
    name: 'Unichain',
    network: 'unichain',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: ['https://mainnet.unichain.org'] },
      public: { http: ['https://mainnet.unichain.org'] },
    },
  },
  transport: http()
});

export default function GetGas() {
  const { connectWallet } = useConnectWallet();
  const { wallets } = useWallets();
  const { logout } = usePrivy();
  const [isVerified, setIsVerified] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState('');
  const [fromNetwork, setFromNetwork] = useState('Unichain');
  const [toNetwork, setToNetwork] = useState('OP Mainnet');
  const [balances, setBalances] = useState({
    unichain: '0',
    optimism: '0'
  });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if wallet is connected
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      setIsWalletConnected(true);
      fetchBalances();
      setDestinationAddress(wallets[0].address); // Set default destination address
    } else {
      setIsWalletConnected(false);
      setDestinationAddress('');
    }
  }, [wallets]);

  const fetchBalances = async () => {
    if (!wallets || wallets.length === 0) {
      setBalances({ unichain: '0', optimism: '0' });
      return;
    }

    try {
      const walletAddress = wallets[0].address as `0x${string}`;
      console.log('Fetching balances for address:', walletAddress);

      // Fetch balances in parallel
      const [optimismBalance, unichainBalance] = await Promise.all([
        optimismClient.getBalance({ address: walletAddress }),
        unichainClient.getBalance({ address: walletAddress })
      ]);

      console.log('Raw balances:', {
        optimism: optimismBalance,
        unichain: unichainBalance
      });

      const formattedBalances = {
        unichain: formatEther(unichainBalance),
        optimism: formatEther(optimismBalance)
      };

      console.log('Formatted balances:', formattedBalances);
      setBalances(formattedBalances);
    } catch (error) {
      console.error('Error fetching balances:', error);
      setBalances({ unichain: '0', optimism: '0' });
    }
  };

  const onSuccess = (result: ISuccessResult) => {
    console.log("Verification successful:", result);
    setIsVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate EVM address using viem
    try {
      if (isAddress(address)) {
        // Simulate transaction hash for demo
        const mockTxHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        setTxHash(mockTxHash);
        setIsSuccess(true);
      } else {
        setError('Please enter a valid EVM address');
      }
    } catch (err) {
      setError('Please enter a valid EVM address');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWalletConnected) {
      try {
        await connectWallet();
      } catch (err) {
        console.error('Failed to connect wallet:', err);
      }
      return;
    }

    if (!amount) {
      return;
    }

    // Handle transfer logic here
    console.log('Transfer:', { amount, fromNetwork, toNetwork });
  };

  const handleNetworkSwitch = () => {
    setFromNetwork(toNetwork);
    setToNetwork(fromNetwork);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsWalletConnected(false);
      setBalances({ unichain: '0', optimism: '0' });
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const renderTransferInterface = () => {
    return (
      <div className="w-full">
        <button
          onClick={() => setShowTransfer(false)}
          className="mb-4 text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back
        </button>
        <div className="space-y-6">
          {isWalletConnected && wallets && wallets.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-800">
                <Image 
                  src={getWalletIcon(wallets[0].walletClientType)}
                  alt={wallets[0].walletClientType} 
                  width={20} 
                  height={20} 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm text-neutral-400">
                {`${wallets[0].address.slice(0, 6)}...${wallets[0].address.slice(-4)}`}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-medium">Transfer ETH</h3>
            {isWalletConnected && (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
          
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* From Network */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-400">From</label>
                {isWalletConnected && (
                  <span className="text-neutral-400">
                    Balance: {fromNetwork === 'Unichain' ? balances.unichain : balances.optimism} ETH
                  </span>
                )}
              </div>
              <select
                value={fromNetwork}
                onChange={(e) => {
                  setFromNetwork(e.target.value);
                  setToNetwork(e.target.value === 'Unichain' ? 'OP Mainnet' : 'Unichain');
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
              >
                <option value="Unichain">Unichain</option>
                <option value="OP Mainnet">OP Mainnet</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-400">Amount</label>
                {isWalletConnected && (
                  <button
                    type="button"
                    onClick={() => setAmount(fromNetwork === 'Unichain' ? balances.unichain : balances.optimism)}
                    className="text-[#8A63D2] text-sm hover:text-[#8A63D2]/80 transition-colors"
                  >
                    Use max
                  </button>
                )}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
              />
            </div>

            {/* To Network */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-400">To</label>
                {isWalletConnected && (
                  <span className="text-neutral-400">
                    Balance: {toNetwork === 'Unichain' ? balances.unichain : balances.optimism} ETH
                  </span>
                )}
              </div>
              <select
                value={toNetwork}
                onChange={(e) => {
                  setToNetwork(e.target.value);
                  setFromNetwork(e.target.value === 'Unichain' ? 'OP Mainnet' : 'Unichain');
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
              >
                <option value="OP Mainnet">OP Mainnet</option>
                <option value="Unichain">Unichain</option>
              </select>
            </div>

            {/* Destination Address */}
            {isWalletConnected && (
              <div className="space-y-2">
                <label className="text-neutral-400 block">Destination Address</label>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Add destination address"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
                />
              </div>
            )}

            {/* Transfer Details */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Gas cost</span>
                <span className="text-neutral-400">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Interface fee</span>
                <span className="text-neutral-400">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">You will receive</span>
                <span className="text-neutral-400">{amount ? `${amount} ETH` : '-'}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isWalletConnected && (!amount || Number(amount) <= 0 || !isAddress(destinationAddress))}
              className={`w-full ${
                isWalletConnected && (!amount || Number(amount) <= 0 || !isAddress(destinationAddress))
                  ? 'bg-neutral-700 cursor-not-allowed'
                  : 'bg-[#67B87C] hover:bg-[#67B87C]/90'
              } text-white font-medium py-3 px-6 rounded-lg transition-colors`}
            >
              {!isWalletConnected 
                ? 'Connect wallet' 
                : !amount || Number(amount) <= 0
                  ? 'Enter amount greater than 0' 
                  : !isAddress(destinationAddress)
                    ? 'Enter valid address'
                    : 'Transfer'
              }
            </button>
          </form>
        </div>
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className={`flex flex-col min-h-screen overflow-x-hidden bg-black text-foreground bg-dotted-grid ${inter.className}`}>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
          }

          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
          }

          .glimmer-card {
            position: relative;
            background: rgb(23, 23, 23);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .glimmer-card::before {
            content: '';
            position: absolute;
            inset: -1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(236, 72, 153, 0.03),
              rgba(236, 72, 153, 0.06),
              rgba(236, 72, 153, 0.03),
              transparent
            );
            background-size: 200% 100%;
            animation: shimmer 8s ease-in-out infinite;
            pointer-events: none;
          }

          .scroll-animation {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .scroll-animation.animate-in {
            opacity: 1;
            transform: translateY(0);
          }

          .scroll-delay-1 { transition-delay: 0.1s; }
          .scroll-delay-2 { transition-delay: 0.2s; }
          .scroll-delay-3 { transition-delay: 0.3s; }
        `}</style>

        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/images/fc-logo.png" 
                alt="Farcaster Logo" 
                className="w-8 h-8"
                width={32}
                height={32}
              />
              <span className={`text-2xl md:text-3xl font-medium ${playfair.className}`}>
                GetGas
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-medium mb-6 ${playfair.className} scroll-animation`}>
              Congrats, pay it forward!
            </h1>
            <div className="mt-8 space-y-4">
              <div className="flex flex-col items-center gap-4">
                <a 
                  href={`https://blockscout.com/optimism/mainnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8A63D2] hover:text-[#8A63D2]/80 transition-colors"
                >
                  View on Blockscout
                </a>
                <a 
                  href={`https://routescan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8A63D2] hover:text-[#8A63D2]/80 transition-colors"
                >
                  View on Routescan
                </a>
              </div>
              <p className="text-xl text-neutral-400 mt-8">
                Bring the world onchain. Pay it forward, donate ETH to placeholder.eth
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-neutral-800/50 scroll-animation">
          <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-sm text-neutral-400">
              This website is unaffiliated with Merkle Manufactory and was created by a{" "}
              <a 
                href="https://warpcast.com/zain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8A63D2] hover:underline"
              >
                Farcaster user
              </a>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen bg-black text-foreground bg-dotted-grid ${inter.className}`}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(5px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .fade-in {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
          will-change: opacity, transform;
        }

        .delay-1 { animation-delay: 0.05s; }
        .delay-2 { animation-delay: 0.1s; }
        .delay-3 { animation-delay: 0.15s; }
      `}</style>

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/images/fc-logo.png" 
              alt="Farcaster Logo" 
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className={`text-2xl md:text-3xl font-medium ${playfair.className}`}>
              GetGas
            </span>
          </Link>
          <button 
            className="sm:hidden p-2 hover:bg-[#8A63D2]/20 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block border-t border-neutral-800/50 mt-4 sm:mt-0 sm:border-t-0`}>
          <nav className="flex flex-col sm:flex-row items-center">
            <Link 
              href="/transfer" 
              className="text-lg px-4 py-4 w-full text-center sm:w-auto transition-colors hover:bg-[#8A63D2]/20"
            >
              Transfer
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-32 sm:pt-28 pb-12 w-full">
        <div className="mb-32">
          <h1 className={`text-4xl md:text-5xl font-medium mb-4 ${playfair.className}`}>
            Get gas on the Superchain
          </h1>
          <p className="text-xl text-neutral-400 mb-16">
            Get gas for your Superchain transactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Button/Form */}
            {!showTransfer && (
              <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 fade-in h-[180px] flex flex-col">
                {!isVerified ? (
                  <div className="flex flex-col">
                    <div>
                      <h3 className={`text-2xl font-medium mb-2 ${playfair.className}`}>
                        Get free ETH on the Superchain
                      </h3>
                      <p className="text-neutral-400 mb-4">
                        With a valid WorldID
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <IDKitWidget
                            app_id={`app_${process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || ""}` as `app_${string}`}
                            action="get_gas"
                            signal={address}
                            onSuccess={onSuccess}
                            verification_level={VerificationLevel.Device}
                          >
                            {({ open }) => (
                              <button
                                onClick={open}
                                className="w-full bg-[#8A63D2] hover:bg-[#8A63D2]/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                              >
                                Verify with World ID
                              </button>
                            )}
                          </IDKitWidget>
                        </div>
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm mt-4">{error}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col">
                    <div>
                      <h3 className={`text-2xl font-medium ${playfair.className}`}>Enter your EVM address</h3>
                      <div className="space-y-4 mt-4">
                        <div>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
                          />
                          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#8A63D2] hover:bg-[#8A63D2]/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        Get free ETH
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Second Button/Transfer Interface */}
            <div className={`${showTransfer ? 'col-span-full' : ''}`}>
              {!showTransfer ? (
                <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 fade-in h-[180px] flex flex-col">
                  <div className="flex flex-col">
                    <div>
                      <h3 className={`text-2xl font-medium mb-2 ${playfair.className}`}>
                        Transfer ETH on the Superchain
                      </h3>
                      <p className="text-neutral-400 mb-4">
                        Transfer ETH across the Superchain
                      </p>
                    </div>
                    <div>
                      <button 
                        onClick={() => setShowTransfer(true)}
                        className="w-full bg-[#8A63D2] hover:bg-[#8A63D2]/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        Transfer ETH
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 fade-in">
                  {renderTransferInterface()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-800/50 scroll-animation">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sm text-neutral-400">
            This website is unaffiliated with Merkle Manufactory and was created by a{" "}
            <a 
              href="https://warpcast.com/zain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#8A63D2] hover:underline"
            >
              Farcaster user
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
} 