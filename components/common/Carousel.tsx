import { HlsSharp } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";

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
        // maxXOffset: 0,
        // minXOffset: 0,
        carouselIdx: 0
    })

    function getTotalItemsWidth(items: NodeListOf<Element>) {
        const { left } = items[0].getBoundingClientRect();
        const { right } = items[items.length - 1].getBoundingClientRect();
        return right - left;
    }

    const transferSlider = (len: number, nextIdx: number, slider: Element) => {
        const transRatio = 100 / len
        const finalTransferX = transRatio * (nextIdx)
        // const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
        slider?.setAttribute('style', `transform: translate3d(${finalTransferX}%, 0px, 0px); transition-duration: 350ms;`)
        setState({ ...state, carouselIdx: nextIdx })
    }

    const prevCallback = useCallback(() => {
        if (Array.isArray(children)) {
            const len = children.length
            const nextIdx = Math.min(state.carouselIdx + 1, Math.floor(len / 2))
            const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
            if (slider)
                transferSlider(len, nextIdx, slider)
        }
        // setItems([items[1], items[2], items[3], items[4], items[0]])
        // const filtered = items.filter((item, idx) => { if (idx !== items.length - 1) return true })
        // setItems([items[items.length - 1], ...filtered])
        // }

    }, [state, items, children])
    const nextCallback = useCallback(() => {
        if (Array.isArray(children)) {
            const len = children.length
            // const nextIdx = state.carouselIdx - 1
            const nextIdx = Math.max(state.carouselIdx - 1, -Math.floor(len / 2))
            const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
            if (slider)
                transferSlider(len, nextIdx, slider)
        }
        // if (Array.isArray(items)) {
        // const filtered = items.filter((item, idx) => { if (idx !== 0) return true })
        // setItems([...filtered, items[0]])
        // }
    }, [state, items, children])

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