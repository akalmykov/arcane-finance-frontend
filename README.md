# Arcane.Finance Front-end with Puzzle Wallet integration
Arcane.finance is a decentralized exchange on Aleo that offers two major benefits:

- **Private swaps**. Users swap encrypted `Records` for encrypted `Records`.
- **Zero slippage, no front-running**. Quotes are cryptographically signed so users trade with 100% price certainty.

## Demo Video
https://www.youtube.com/watch?v=_nNIw9ClwjE

## Live demo
http://dev.arcane.finance

## Motivation: classic AMMs and Aleo

Constant function Automated Market Makers (AMMs), such as Uniswap or Curve, are perhaps the most integral part of the traditional DeFi ecosystem.

While having many advantages, AMMs on Aleo cannot fully utilize the core privacy-enabling primitives of Aleo: off chain `transition` functions and encrypted `Records`. Because an AMM needs to know up-to-date pool reserves, most of its code has to be placed in a `finalize` function, which is executed on chain and cannot operate on `Records`. This can fixed by relaxing constraints on price function invariant, but this introduce new challenges e.g. with correct handling of slippage. 

For the Aleo ecosystem to grow and be competitive, its decentralized exchanges need to leverage unique privacy-preserving features of Aleo and off-chain computation. This is why we are building a DEX on an entirely different model called "Request-For-Quote" (RFQ).

## What is a Request-For-Quote?

Request-for-quote (RFQ) is a form of P2P swaps. Our protocol offers users OTC (over-the-counter) desk experience, but automated, private and cryptographically signed.

Here’s traditional how OTC trades work:

1. You ask the seller: “Hey, I want to trade my 10 BTC for USDT.”
2. She responds with an offer: “260,079 USDT. Take it or leave it.”
3. If you like the offer, you execute the trade.

Now imagine that you receive cryptographically signed quotes from several sellers, automatically pick the best deal and can execute the trade immediately if you like it. And all this while remaining private. Sounds good? This is exactly how our RFQ DEX works.

In a nutshell, an AMM pricing function `x*y=k` is now replaced with a cryptographically signed, private quote, which is verified off chain, in a `transition`. The pricing is done off chain but the trade is executed on chain.

Some examples of DeFi projects that use RFQ model are: [Hashflow](https://www.hashflow.com/), [Orbiter Finance](https://www.orbiter.finance/), [Hop](https://hop.exchange/), [Airswap](www.airswap.io) 

## How can an RFQ DEX benefit the Aleo Ecosystem?

While this project is an early stage Proof-of-Concept, it already shows that Aleo enables building privacy-preserving DeFi protocols that have real competitive advantages over existing solutions.

There are other considerations behind our choice of RFQ model on Aleo:

1. Institutional Adoption

RFQ model is rooted in traditional financial markets. The adoption of RFQ mechanics can attract to Aleo more sophisticated, institutional participants, with deep liquidity and diverse assets.

3. Expansion to Other Asset Classes
   
RFQ-based execution engines are extremely flexible and can easily be expanded to accommodate derivatives and other financial instruments.

5. Transformation to Dark Pools
   
Our long term vision includes an extension to RFQ model that would allow for completely trustless, but fully regulated dark pools. This will provide additional liquidity and anonymity for trading large blocks of securities without incurring market impact costs.

## Contract
Contract source code can be found here: https://github.com/akalmykov/rfq-aleo-dex

