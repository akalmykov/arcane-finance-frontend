import { Icons } from 'assets';
import { Token } from 'shared/types';

export const iconByToken = {
    [Token.USDC]: <Icons.Usdc />,
    [Token.USDT]: <Icons.Usdt />,
    [Token.WBTC]: <Icons.Btc />,
    [Token.WETH]: <Icons.Eth />,
};
