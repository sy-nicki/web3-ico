"use client"
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA, transferToken, createPool, sweep, modifyPool} from '@/context'
import { AdminAddress } from '@/contracts/config'

const Page = () => {
    const { address } = useAccount();
    const [loader, setLoader] = useState(false);
    const [checkAdmin, setCheckAdmin] = useState(true);
    const [poolDetails, setPoolDetails] = useState();
    const [modifyPoolID, setModifyPoolID] = useState();

    const LOAD_DATA = async () => {
        if (address) {
            setLoader(true);
            if (address?.toLowerCase() === AdminAddress?.toLowerCase()) {
                setCheckAdmin(false);
                const data = await CONTRACT_DATA(address);
                console.log(data, 'pppppppppppp');
                setPoolDetails(data);
            }
            setLoader(false);
        }
    };
    useEffect(() => {
        LOAD_DATA();
    }, [address])
    return (
        <div>
            admin
        </div>
    );
};
export default Page;
