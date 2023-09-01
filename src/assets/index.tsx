import { ReactComponent as Logo } from './icons/logo.svg';
import { ReactComponent as Gear } from './icons/gear.svg';
import { ReactComponent as Usdc } from './icons/usdc.svg';
import { ReactComponent as Usdt } from './icons/usdt.svg';
import { ReactComponent as AngleDown } from './icons/angle-down.svg';
import { ReactComponent as ArrowDown } from './icons/arrow-down.svg';
import { ReactComponent as ArrowRight } from './icons/arrow-right.svg';
import { ReactComponent as Close } from './icons/close.svg';
import { ReactComponent as Search } from './icons/search.svg';
import { ReactComponent as Btc } from './icons/btc.svg';
import { ReactComponent as Eth } from './icons/eth.svg';
import { ReactComponent as Plus } from './icons/plus.svg';
import { ReactComponent as Minus } from './icons/minus.svg';
import puzzle from './icons/puzzle.png';
import leo from './icons/leo.png';

const Puzzle = () => {
    return <img src={puzzle} alt="puzzle icon" />;
};

const Leo = () => {
    return <img src={leo} alt="leo icon" />;
};

export const Icons = {
    Logo,
    Gear,
    Usdt,
    Usdc,
    AngleDown,
    ArrowDown,
    Close,
    Search,
    Btc,
    Eth,
    ArrowRight,
    Plus,
    Minus,
    Puzzle,
    Leo,
};
