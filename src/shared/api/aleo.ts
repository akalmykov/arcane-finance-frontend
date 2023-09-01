import axios from 'axios';
import { config } from 'shared/config';
import { tokens } from 'shared/consts';
import { getObjectValueByKey } from 'shared/utils/getObjectValueByKey';

export const fetchPublicPairs = async (pair: string): Promise<any> => {
    return await axios
        .get(
            `https://explorer.hamp.app/api/v1/mapping/get_value/${config.public.contract}/${config.public.mappings.pools}/${pair}`,
        )
        .then((response) => ({
            reserve_a: getObjectValueByKey('reserve0', response.data),
            reserve_b: getObjectValueByKey('reserve1', response.data),
        }));
};

export const fetchPrivateSwapData = async (
    token_in: number | string,
    token_out: number | string,
    amount_in: number | string,
) => {
    return await axios
        .get(
            `https://ftoy1oiyo6.execute-api.us-east-1.amazonaws.com/default/leoswap-maker`,
            {
                params: {
                    token_in,
                    token_out,
                    amount_in,
                },
            },
        )
        .then((response) => response.data);
};

const fetchPublicBalanceByKey = async (key: string) => {
    return await axios
        .get(
            `https://explorer.hamp.app/api/v1/mapping/get_value/${config.public.contract}/${config.public.mappings.balances}/${key}`,
        )
        .then((response) => response.data);
};

export const fetchPublicBalance = async (address: string) => {
    const balanceKeysStr = await axios
        .get(
            `https://explorer.hamp.app/api/v1/mapping/get_value/${config.public.contract}/${config.public.mappings.balance_keys}/${address}`,
        )
        .then((response) => response.data);

    const result: any = {};

    for (let token of tokens) {
        const regex = new RegExp(`key${config[token].id}:\\s*(\\d+)field`);

        const searchResult = balanceKeysStr.match(regex);

        if (searchResult && searchResult[1] != 0) {
            const balanceKey = `${searchResult[1]}field`;

            const balance = await fetchPublicBalanceByKey(balanceKey);

            result[token] = balance.replace('u128', '');
        }
    }

    return result;
};
