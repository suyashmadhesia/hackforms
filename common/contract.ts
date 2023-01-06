/**
 * 
 * Following functionalities and flow should be added
 * 
 * Fund Deal: A deal can be funded when creating/updating the form
 *     - Rate of the deal, maxNumberOfResponse must be decided
 *     - After both data are filled, Connect Wallet button will appear for payment
 *     - After payment success/failure `isPayable` flag will be updated with wallet address 
 *              inserted in payableWallet
 *     - How to determine payment is done?
 *          - before publishing check the balance of the deal and only move forward if rate * numOfRes < balance;
 * Has enough balance:
 *     - Before completing the response if the form isPayable
 *     - User will be prompt to connect a wallet for recv the payment and option to skip the step with eoa being the value
 *     - If eoa is web2 the wallet connection is compulsory to fill the form
 * 
 * Balance Of Deal:
 *      - Shows the deal balance with the form
 * Balance:
 *      - Shows the balance of the account only if wallet is connected
 *      - if eoa is web3 then it will try to check the existence of balance
 * Disburse:
 *      - It will take arguments and process the fund
 * 
 * // All amounts passed will be in ETH
 */
import {ethers} from 'ethers';
import HackformsEscrowData from '../build/HackformsEscrow.json'
import {HackformsEscrow} from '../build/contracts/index';

export function getProvider(provider: ethers.providers.ExternalProvider): ethers.providers.Web3Provider {
    return new ethers.providers.Web3Provider(provider);
}

export function getCoinbaseProvider(): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(
        {
            url: process.env.NEXT_PUBLIC_COINBASE_RPC_URL as string,
            user: process.env.NEXT_PUBLIC_COINBASE_USERNAME as string,
            password: process.env.NEXT_PUBLIC_COINBASE_PASSWORD
        }
    )
    
}


export function getSignerFromWalletProvider(provider: ethers.providers.Web3Provider): ethers.providers.JsonRpcSigner {
    return provider.getSigner()
}


export function connectCoinbaseProviderWithSigner(signer: ethers.providers.JsonRpcSigner, provider: ethers.providers.JsonRpcProvider) {
    return signer.connect(provider);
}

export function getEscrowContract(provider: ethers.providers.JsonRpcProvider) {
    return (new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT as string,
        HackformsEscrowData['abi'],
        provider
    )) as HackformsEscrow;
}

export function attachSigner( contract: HackformsEscrow, signer: ethers.providers.JsonRpcSigner) {
    return contract.connect(signer);
}



export async function getBalanceOfDeal(contract: HackformsEscrow, formId: string) {
    return formatBigNumberToEth(await contract.balanceOfDeal(formId));
}

export function formatBigNumberToEth(num: ethers.BigNumber) {
    return ethers.utils.formatEther(num);
}

export function parseToBigNumber(eth: string) {
    return ethers.utils.parseEther(eth);
}


export async function getBalanceOfAddress(contract: HackformsEscrow) {
    return formatBigNumberToEth(await contract.balance());
}

export async function disburseFund(contract: HackformsEscrow, data: {
    formId: string;
    rate: string;
    recps: string[]
}) {
    return await contract.disburseFund(data.formId, parseToBigNumber(data.rate), data.recps);
}


export async function fundDeal(contract: HackformsEscrow, data: {
    formId: string,
    amount: string
}) {
    return await contract.fundDeal(data.formId, {
        value: parseToBigNumber(data.amount)
    })
}

export async function hasEnoughBalance(contract: HackformsEscrow, data: {
    formId: string,
    amount: string
}) {
    return await contract.hasEnoughBalance(data.formId, parseToBigNumber(data.amount))
}



export class HackformsEscrowContractHandler {

    public readonly contract: HackformsEscrow;
    public signer?: ethers.providers.JsonRpcSigner

    constructor(signer?: ethers.providers.JsonRpcSigner) {
        const provider = getCoinbaseProvider()
        this.contract = getEscrowContract(provider);
        this.signer = signer;
        if (this.signer) {
            this.attach(this.signer);
        }
    }

    injectSelf() {
        (globalThis as any).escrow = this;
    }

    attach(signer: ethers.providers.JsonRpcSigner) {
        attachSigner(this.contract, signer);
    }

    async balanceOfDeal(formId: string) {
        return getBalanceOfDeal(this.contract, formId);
    }

    async balance() {
        return getBalanceOfAddress(this.contract);
    }

    async disburseFund(formId: string, rate: number, recps: string[]) {
        return await disburseFund(this.contract, {
            formId,
            rate: rate.toString(),
            recps
        });
    }

    async fundDeal(formId: string, amount: number) {
        return await fundDeal(this.contract, {
            formId,
            amount: amount.toString()
        })
    }

    async getAddress() {
        return await this.contract.signer.getAddress()
    }

    async hashEnoughBalance(formId: string, amount: number) {
        return await hasEnoughBalance(this.contract, {
            formId,
            amount: amount.toString()
        })
    }
}