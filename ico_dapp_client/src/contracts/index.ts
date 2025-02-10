import { ethers, formatUnits, formatEther, JsonRpcProvider } from 'ethers'
import { useAccount, useClient } from 'wagmi'
import {
    StakingDappAddress,
    TokenIcoAddress,
    StakingDappAbi,
    TokenIcoAbi,
    ERCTokenAbi,
    DepositTokenAddress,
    RewardTokenAddress
} from './config'

export function clientToProvider() {
    const { chain, transport } = useClient()
    if (!chain || !transport) return undefined
    console.log(chain, transport, 'ppp')
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address
    }

    return new JsonRpcProvider(transport.url, network)
}

export function toEth(amount, decimals = 18) {
    const toEth = formatUnits(amount, decimals)
    return toEth.toString()
}

export const tokenContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const { ethereum } = window
    if (ethereum) {
        const signer = await provider.getSigner()
        const contractReader = new ethers.Contract(
            DepositTokenAddress,
            ERCTokenAbi,
            signer
        )
        return contractReader
    }
}

export const contract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const { ethereum } = window
    if (ethereum) {
        const signer = await provider.getSigner()
        const contractReader = new ethers.Contract(
            StakingDappAddress,
            StakingDappAbi,
            signer
        )
        return contractReader
    }

}
export const ERC20 = async (address, userAddress) => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const { ethereum } = window
    if (ethereum) {
        const signer = await provider.getSigner()
        const contractReader = new ethers.Contract(
            address,
            ERCTokenAbi,
            signer
        )
        const token = {
            name: await contractReader.name(),
            symbol: await contractReader.symbol(),
            address: await contractReader.address,
            totalSupply: toEth(await contractReader.totalSupply()),
            balance: toEth(await contractReader.balanceOf(userAddress)),
            contractTokenBalance: toEth(await contractReader.balanceOf(STAKING_DAPP_ADDRESS))
        }
        return token // 返回代币信息对象
    }
}
export const LOAD_TOKEN_ICO = async () => {
    try {
        const contract = await TOKEN_ICO_CONTRACT()
        const tokenAddress = await contract.tokenAddress()
        const ZERO_ADDRSEE = 0x0000000000000000000000000000000000000000

        if (tokenAddress != ZERO_ADDRSEE) {
            const tokenDetails = await contract.getTokenDetails()
            const contractOwner = await contract.owner()
            const soldTokens = await contract.soldTokens()
            const ICO_TOKEN = await TOKEN_ICO_ERC20()
            const token = {
                tokenBal: formatEther(tokenDetails.balance.toString()),
                name: tokenDetails.name,
                symbol: tokenDetails.symbol,
                supply: formatEther(tokenDetails.supply.toString()),
                tokenPrice: formatEther(tokenDetails.tokenPrice.toString()),
                tokenAddr: tokenDetails.tokenAddr,
                owner: contractOwner.toLowerCase(),
                soldTokens: soldTokens.toNumber(),
                token: ICO_TOKEN
            }
            return token
        }

    } catch (error) {
        console.log(error)
    }
}

export const TOKEN_ICO_CONTRACT = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const { ethereum } = window
    if (ethereum) {
        const signer = await provider.getSigner()
        const contractReader = new ethers.Contract(TokenIcoAddress, TokenIcoAbi, signer)
        return contractReader
    }
}
export const TOKEN_ICO_ERC20 = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const { ethereum } = window
        if (ethereum) {
            const signer = await provider.getSigner()
            const contractReader = new ethers.Contract(DepositTokenAddress, ERCTokenAbi, signer)

            const userAddress = await signer.getAddress()
            const nativeBalance = await signer.getBalance()
            const balance = await contractReader.balanceOf(userAddress)

            const token = {
                address: await contractReader.address,
                name: await contractReader.name(),
                symbol: await contractReader.symbol(),
                decimals: await contractReader.decimals(),
                supply: toEth(await contractReader.totalSupply()),
                balance: toEth(await contractReader.balanceOf(userAddress)),
                nativeBalance: toEth(nativeBalance.toString())
            }
            return token
        }
    } catch (e) {

    }
}
