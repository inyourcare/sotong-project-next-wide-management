import { ChangeEventHandler, FormEventHandler, MouseEventHandler } from "react";
import { BiListCheck, BiSearchAlt2 } from "react-icons/bi";
import ParosBtnGnbSearch from 'public/paros/btn-gnb-search.svg';
export function SearchBar(
    { onSubmit, onChange, placeHolder, searchImg }
        : {
            onChange: ChangeEventHandler<HTMLInputElement>,
            // onClick: MouseEventHandler<HTMLButtonElement>,
            onSubmit: FormEventHandler<HTMLFormElement>,
            placeHolder: string,
            searchImg: 'BiSearchAlt2' | 'ParosBtnGnbSearch'
        }) {
    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        type="search"
                        placeholder={placeHolder}
                        onChange={onChange}
                    />
                    <button type="submit">
                        {searchImg === 'BiSearchAlt2' && <BiSearchAlt2></BiSearchAlt2>}
                        {searchImg === 'ParosBtnGnbSearch' && <ParosBtnGnbSearch />}
                    </button>
                </form>
            </div>
        </>
    );
}