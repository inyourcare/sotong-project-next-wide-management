import { HlsSharp } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export const useStyles = makeStyles((theme) => ({
    container: {
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    slider: {
        display: 'flex',
        flex: '1 1 500px',
        listStyle: 'none',
        padding: '0',
        margin: '0 10px',
    },
    item: {
        flext: '0 0 150px',
        // height: '215px',
        marginLeft: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        '&:first-child': {
            marginLeft: '0',
        }
    },
    controls: {
        marginTop: '20px',
        flext: '1 1 100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& button': {
            border: 'none',
            borderRadius: '25px',
            background: 'hsla(0,90%,65%,1)',
            padding: '12px 15px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '18px',
            '-webkit-appearance': 'none',
            cursor: 'pointer',
        }
    },
    progressBar: {
        flext: '0 0 200px',
        height: '4px',
        borderRadius: '4px',
        margin: '0 20px',
        bckground: 'hsla(0,90%,65%,1)',
        transform: 'scaleX(0)',
        transformOrigin: '0% 50%',
    }
}))
export interface CarouselProps {
    children?: ReactNode,
    // containerUniqueId: string
}
export const Carousel = (props: CarouselProps) => {
    // const { children, containerUniqueId } = props;
    const { children } = props;
    const [items, setItems] = useState(children)
    const classes = useStyles();
    // const containerUniqueId = `carousel_container_${(Math.random() + 1).toString(36).substring(7)}`
    const sliderClassName = 'slider'
    const itemClassName = 'item'
    const containerRef = useRef<HTMLDivElement>(null)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const [state, setState] = useState({
        maxXOffset: 0,
        minXOffset: 0
    })

    // useEffect(() => {
    //     const container = document.querySelector(containerUniqueKey)
    //     if (container) {
    //         const slider = container.querySelector(`.${sliderClassName}`);
    //         if (slider) { const items = slider.querySelectorAll(`.${itemClassName}`); }
    //         else {
    //             console.error('carousel slider not found')
    //         }
    //     }
    //     else {
    //         console.error('carousel container not found')
    //     }
    // }, [containerUniqueKey])
    function getTotalItemsWidth(items: NodeListOf<Element>) {
        const { left } = items[0].getBoundingClientRect();
        const { right } = items[items.length - 1].getBoundingClientRect();
        return right - left;
    }


    const prevCallback = useCallback(() => {
        console.log('prev click', state.maxXOffset, state.minXOffset)
        const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
        // slider?.setAttribute('transform','translateX(-100px)')
        // slider?.setAttribute('style',`transform: translateX(${state.minXOffset}px)`)
        // slider?.setAttribute('style',`transform: translateX(${1060}px)`)
        // slider?.setAttribute('style',``)
        // if (Array.isArray(children)) {
        if (Array.isArray(items)) {
            // const item = children.splice(children.length-1,1)
            // const item = items[items.length-1]
            // const newArr = items.slice(0,items.length-1)
            // newArr.concat(item)
            // setItems([items[1], items[2], items[3], items[4], items[0]])
            const filtered = items.filter((item, idx) => { if (idx !== items.length - 1) return true })
            setItems([items[items.length - 1], ...filtered])
            // [children[0], children[1], children[2], children[3], children[4]] = [children[1], children[2], children[3], children[4], children[0]]
            // [test[0], test[1], test[2], test[3], test[4]] = [test[1], test[2], test[3], test[4], test[0]]
            // setTest([test[1], test[2], test[3], test[4], test[0]])
        }

    }, [state, items])
    const nextCallback = useCallback(() => {
        console.log('next click', state.maxXOffset, state.minXOffset)
        const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
        // slider?.setAttribute('transform','translateX(100px)') 
        // slider?.setAttribute('style',`transform: translateX(${-state.minXOffset}px)`)
        // slider?.setAttribute('style',`transform: translateX(${-1060}px)`)
        // slider?.setAttribute('style',``)
        if (Array.isArray(items)) {
            const filtered = items.filter((item, idx) => { if (idx !== 0) return true })
            setItems([...filtered, items[0]])
        }
    }, [state, items])

    useEffect(() => {
        const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
        const sliderVisibleWidth = containerRef.current?.offsetWidth;
        console.log('container ref')
        if (slider && sliderVisibleWidth) {
            const items = slider.querySelectorAll(`.${itemClassName}`);
            const totalItemsWidth = getTotalItemsWidth(items);
            // const maxXOffset = 0;
            // const minXOffset = - (totalItemsWidth - sliderVisibleWidth);
            setState({
                ...state,
                maxXOffset: 0,
                minXOffset: - (totalItemsWidth - sliderVisibleWidth)
            })
            console.log(sliderVisibleWidth, slider.clientWidth, slider.scrollWidth, totalItemsWidth)
            // prevRef.current?.removeEventListener("click", prevCallback)
            // prevRef.current?.addEventListener("click", prevCallback);
            // prevRef.current?.addEventListener("click", ()=>{console.log('prev click')});
            // nextRef.current?.removeEventListener("click", nextCallback)
            // nextRef.current?.addEventListener("click", nextCallback);
            // nextRef.current?.addEventListener("click", ()=>{console.log('next click')});
        }
        else {
            console.error('carousel slider not found')
        }
        return
    }, [containerRef, containerRef.current?.offsetWidth])

    return (<>

        {/* <div className={`${containerUniqueKey} ${classes.container}`}> */}
        <div className={`${classes.container}`} ref={containerRef}>
            <ul className={`${sliderClassName} ${classes.slider}`}>
                {/* <ul className={`${classes.slider}`}> */}
                {
                    // Array.isArray(children) ?
                    //     children.map((child, index) => {
                    Array.isArray(items) ?
                        items.map((child, index) => {
                            return (<li key={index} className={`${itemClassName} ${classes.item}`}>{child}</li>)
                            // return (<li key={index} className={`${classes.item}`}>{child}</li>)
                        })
                        :
                        (<>empty</>)

                }
            </ul>
        </div>
        <div className={`${classes.controls}`}>
            <button className="prev" ref={prevRef} onClick={prevCallback}>Prev</button>
            <div className={`${classes.progressBar}`}></div>
            <button className="next" ref={nextRef} onClick={nextCallback}>Next</button>
        </div>
    </>)
}

export default Carousel;