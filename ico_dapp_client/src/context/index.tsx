'use client'
import { parseUnits,parseEther, ethers , formatEther, hexlify} from 'ethers'
import { toast } from '@/hooks/use-toast'

import { contract, tokenContract, ERC20, toEth, TOKEN_ICO_CONTRACT } from '@/contracts'
import { RewardTokenAddress, DepositTokenAddress } from '@/contracts/config'

const notifySuccess = (msg) => toast({ description: msg })
const notifyError = (msg) => toast({ variant: 'destructive', description: msg })

function CONVERT_TIMESTAMP_TO_READABLE(timeStamp) {
    const date = new Date(timeStamp * 1000)

    const userLocale = navigator.language || 'en-US'

    const readableTime = date.toLocaleDateString(userLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })

    return readableTime
}

function toWei(amount) {
    const towei = parseUnits(amount.toString())
    return towei.toString()
}

function parseErrorMsg(e) {
    const json = JSON.parse(JSON.stringify(e))
    return json?.reason || json?.error?.message
}

export const SHORTEN_ADDRESS = (address) => `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`

export const copyAddress = (text) => {
    navigator.clipboard.writeText(text)
    notifySuccess('Copied successfully')
}

export async function CONTRACT_DATA(address) {
    try {
        const contractObj = await contract()
        const stakingTokenObj = await tokenContract()


        if (address) {
            const contractOwner = await contractObj.owner()
            const contractAddress = await contractObj.address

            // NOTIFICATIONS
            const notifications = await contractObj.getNotifications()
            const _notificationsArray = await Promise.all(
                notifications.map(async ({ poolID, amount, user, typeOf, timestamp }) => {
                    return {
                        poolID: poolID.toNumber(),
                        amount: toEth(amount),
                        user: user,
                        typeOf: typeOf,
                        timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp)
                    }
                })
            )
            let poolInfoArray = []
            const poolLenght = await contractObj.poolCount()
            const length = poolLenght.toNumber()

            for (let i = 0; i < length; i++) {
                const poolInfo = await contractObj.poolInfo(i)
                console.log(poolInfo, 'poolInfoArray')
                const userInfo = await contractObj.userInfo(i, address)
                const userReward = await contractObj.pendingReward(i, address)

                const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address)
                const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address)

                const pool = {
                    depositTokenAddress: poolInfo.depositToken,
                    rewardTokenAddress: poolInfo.rewardToken,
                    depositToken: tokenPoolInfoA,
                    rewardToken: tokenPoolInfoB,
                    depositedAmount: toEth(poolInfo.depositedAmount.toString()),
                    apy: poolInfo.apy.toString(),
                    lockDays: poolInfo.lockDays.toString(),
                    // USER
                    amount: toEth(userInfo.amount.toString()),
                    userReward: toEth(userReward),
                    lockUntil: CONVERT_TIMESTAMP_TO_READABLE(userInfo.lockUntil.toNumber()),
                    lastRewardAt: toEth(userInfo.lastRewardAt.toString())
                }
                poolInfoArray.push(pool) // 将 pool 对象添加到数组中
            }
            const totalDepositAmount = poolInfoArray.reduce((total, pool) => {
                return total + parseFloat(pool.depositedAmount)
            }, 0)

            const rewardToken = await ERC20(RewardTokenAddress, address)
            const depositToken = await ERC20(DepositTokenAddress, address)

            const data = {
                contractOwner: contractOwner,
                contractAddress: contractAddress,
                notifications: _notificationsArray.reverse(),
                rewardToken: rewardToken,
                depositToken: depositToken,
                poolInfoArray: poolInfoArray,
                totalDepositAmount: totalDepositAmount,
                contractTokenBalance: depositToken.contractTokenBalance - totalDepositAmount
            }
            return data
        }
    } catch (error) {
        // console.log(error)
        console.log(parseErrorMsg(error))
        return parseErrorMsg(error)
    }
}

export async function deposit(poolID, amount, address) {
    try {
        notifySuccess("calling contract...");
        const contractObj = await contract();
        const stakingTokenObj = await tokenContract();

        const amountInWei = parseUnits(amount.toString(), 18);

        const currentAllowance = await stakingTokenObj.allowance(
            address,
            contractObj.address
        );

        if (currentAllowance.lt(amountInWei)) {
            notifySuccess("Approving token...");
            const approveTx = await stakingTokenObj.approve(
                contractObj.address,
                amountInWei
            );

            await approveTx.wait();
            // console.log(`Approved ${amountInWei.toString()} tokens for staking`);
        }

        const gasEstimation = await contractObj.estimateGas.deposit(
            Number(poolID),
            amountInWei
        );

        notifySuccess("Staking token call....");
        const stakeTx = await contractObj.deposit(Number(poolID), amountInWei, {
            gasLimit: gasEstimation,
        });

        const receipt = await stakeTx.wait();
        notifySuccess("Token take successfully");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}

export async function transferToken(amount, transferAddress) {
    try {
        notifySuccess("calling contract token...");

        const stakingTokenObj = await tokenContract();

        const transferAmount = parseEther(amount);

        const approveTx = await stakingTokenObj.transfer(transferAddress, transferAmount);

        const receipt = await approveTx.wait();
        notifySuccess("token transfer successfully");
        return receipt
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}
export async function withdraw(poolID, amount) {
    try {
        notifySuccess("calling contract...");

        const amountInWei = parseUnits(amount.toString(), 18);

        const contractObj = await contract();
        const gasEstimation = await contractObj.estimateGas.withdraw(
            Number(poolID),
            amountInWei
        );

        const data = await contractObj.withdraw(Number(poolID), amountInWei, {
            gasLimit: gasEstimation,
        });

        const receipt = await data.wait();
        notifySuccess("transactions successfully completed");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}
export async function claimReward(poolID) {
    try {
        notifySuccess("calling contract...");
        const contractObj = await contract();

        const gasEstimation = await contractObj.estimateGas.claimReward(Number(poolID));

        const data = await contractObj.claimReward(Number(poolID), {
            gasLimit: gasEstimation,
        });

        const receipt = await data.wait();
        notifySuccess("Reward claim successfully completed");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}
export async function createPool(pool) {
    try {
        const { _depositToken, _rewardToken, _apy, _lockDays } = pool;
        if (!_depositToken || !_rewardToken || !_apy || !_lockDays) {
            return notifyError("Provide all the details");
        }

        notifySuccess("calling contract...");
        const contractObj = await contract();

        const gasEstimation = await contractObj.estimateGas.addPool(
            _depositToken,
            _rewardToken,
            Number(_apy),
            Number(_lockDays)
        );

        const stakeTx = await contractObj.addPool(
            _depositToken,
            _rewardToken,
            Number(_apy),
            Number(_lockDays),
            {
                gasLimit: gasEstimation,
            }
        );

        const receipt = await stakeTx.wait();
        notifySuccess("Pool Created successfully");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}
export async function modifyPool(poolID, amount) {
    try {
        notifySuccess("calling contract...");
        const contractObj = await contract();
        const gasEstimation = await contractObj.estimateGas.modifyPool(
            Number(poolID),
            Number(amount)
        );
        const data = await contractObj.modifyPool(Number(poolID), Number(amount), {
            gasLimit: gasEstimation,
        });
        const receipt = await data.wait();
        notifySuccess("Pool Modify successfully");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
}
export async function sweep(tokenData) {
    try {
        const { token, amount } = tokenData;
        if (!token || !amount) return notifyError("Data is missing");

        notifySuccess("calling contract...");
        const contractObj = await contract();

        const transferAmount = parseEther(amount);

        const gasEstimation = await contractObj.estimateGas.sweep(
            token,
            transferAmount
        );

        const data = await contractObj.sweep(token, transferAmount, {
            gasLimit: gasEstimation,
        });

        const receipt = await data.wait();
        notifySuccess("transaction completed successfully");
        return receipt;
    } catch (error) {
        console.log(error);
    }
}
export const addTokenMetaMask = async (token) => {
    if (window.ethereum) {
        const contract = await tokenContract();
        const tokenDecimals = await contract.decimals();
        const tokenAddress = await contract.address;
        const tokenSymbol = await contract.symbol();

        try {
            const wasAdded = await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                        image: './token.jpeg',
                    },
                },
            });

            if (wasAdded) {
                notifySuccess("Token added");
            } else {
                notifyError("Failed to add token");
            }
        } catch (error) {
            notifyError("Failed to add token");
        }
    } else {
        notifyError("MetaMask is not installed");
    }
};
// ICO CONTRACT
export const BUY_TOKEN = async (amount) => {
    try {
        notifySuccess("calling ico contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const tokenDetails = await contract.gettokenDetails();
        const avalableToken = formatEther(
            tokenDetails.balance.toString()
        );

        if (avalableToken > 1) {
            const price = formatEther(tokenDetails.tokenPrice.toString()) *
                Number(amount);

            const payAmount = parseUnits(price.toString(), "ether");

            const transaction = await contract.buyToken(Number(amount), {
                value: payAmount.toString(),
                gasLimit: hexlify('8000000'),
            });

            const receipt = await transaction.wait();

            notifySuccess("Transaction successfully completed");
            return receipt;
        } else {
            notifyError("Token balance is lower then expected");
            return 'receipt'; // 这里 return receipt 可能会导致问题，稍后解释
        }
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
};

export const TOKEN_WITHDRAW = async () => {
    try {
        notifySuccess("calling ico contract");
        const contract = await TOKEN_ICO_CONTRACT();
        const tokenDetails = await contract.gettokenDetails();
        const avalableToken = formatEther(
            tokenDetails.balance.toString()
        );

        if (avalableToken > 1) {
            const transaction = await contract.withdrawTokens();

            const receipt = await transaction.wait();

            notifySuccess("Transaction successfully completed");
            return receipt;
        } else {
            notifyError("Token balance is lower then expected");
            return 'receipt'; // 这里 return receipt 可能会导致问题，稍后解释
        }
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
};

export const UPDATE_TOKEN = async (_address) => {
    try {
        if (!_address) return notifyError("Data is missing");
        notifySuccess("Calling contract");
        const contract = await TOKEN_ICO_CONTRACT();
        const gasEstimation = await contract.estimateGas.updateToken(_address);
        const transaction = await contract.updateToken(_address, { // 这里应使用 _address 而非 Number(amount)
            gasLimit: gasEstimation,
        });
        const receipt = await transaction.wait();
        notifySuccess("Transaction successfully completed");
        return receipt;
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
    }
};
export const UPDATE_TOKEN_PRICE = async (price) => {
    try {
        if (!price) return notifyError("Data is missing");
        notifySuccess("Calling contract");
        const contract = await TOKEN_ICO_CONTRACT();

        const payAmount = parseUnits(price.toString(), "ether");

        const gasEstimation = await contract.estimateGas.updateTokenSalePrice(payAmount); // 这里 _address 未定义，需要修正

        const transaction = await contract.updateTokenSalePrice(payAmount, { //
            gasLimit: gasEstimation,
        });
        const receipt = await transaction.wait(); // 添加 await transaction.wait()
        notifySuccess("Transaction successfully completed"); // 添加成功提示
        return receipt; // 添加 return receipt
    } catch (error) {
        console.log(error);
        const errorMsg = parseErrorMsg(error);
        notifyError(errorMsg);
        return null; // 添加 return null
    }
};
export const addTokenToMetaMask = async () => {

}

