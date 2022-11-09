import { ChangeEventHandler, MouseEventHandler } from "react";
import { BiListCheck, BiSearchAlt2 } from "react-icons/bi";
export function SearchBar({ onClick, onChange, placeHolder }: { onChange: ChangeEventHandler<HTMLInputElement>, onClick: MouseEventHandler<HTMLButtonElement>, placeHolder: string }) {
    return (
        <>
            <div>
                <input
                    type="search"
                    placeholder={placeHolder}
                    onChange={onChange}
                />
                <button type="button" onClick={onClick}>
                    <BiSearchAlt2></BiSearchAlt2>
                </button>
            </div>
        </>
    );
}