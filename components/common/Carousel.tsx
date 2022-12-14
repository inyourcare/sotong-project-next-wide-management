import { HlsSharp } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";

interface StyleProps {
    // blurred: boolean,
    itemOpacity: string
}
// export const useStyles = (props:any) => makeStyles((theme) => ({
export const useStyles = makeStyles((theme) => ({
    container: {
        overflow: 'hidden',
        // overflow: 'scroll',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    slider: {
        // width: '150%',
        display: 'flex',
        // flex: '1 1 500px',
        listStyle: 'none',
        padding: '0',
        margin: '0 10px',
    },
    // item: ({ itemOpacity }: StyleProps) => ({
    //     // width: '100%',
    //     flext: '0 0 150px',
    //     // height: '215px',
    //     // marginLeft: '10px',
    //     // borderRadius: '5px',
    //     borderRadius: '50px',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     '&:first-child': {
    //         marginLeft: '0',
    //     },
    //     opacity: true && '.4',
    //     // opacity: itemOpacity,
    //     '&.selected': {
    //         opacity: '1',
    //     }
    // }),
    item: {
        // width: '100%',
        flext: '0 0 150px',
        // height: '215px',
        // marginLeft: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        '&:first-child': {
            marginLeft: '0',
        },
        // c,
        // opacity: itemOpacity,
        '&.selected': {
            opacity: '1',
        }
    },
    itemBlurred: {
        opacity: '.4',
    },
    controls: {
        position: 'absolute',
        // zIndex: '1',
        top: '0',
        // marginTop: '20px',
        // flex: '1 1 100%',
        width: '100%',
        height: '100%',
        display: 'inline-block',
        // justifyContent: 'center',
        // alignItems: 'center',

        // '& button': {
        //     border: 'none',
        //     borderRadius: '25px',
        //     background: 'hsla(0,90%,65%,1)',
        //     padding: '12px 15px',
        //     color: 'white',
        //     fontSize: '18px',
        //     fontWeight: 'bold',
        //     lineHeight: '18px',
        //     '-webkit-appearance': 'none',
        //     cursor: 'pointer',
        // },
        '& .prev': {
            float: 'left',
            color: '#fff',
            height: '100%',
            opecity: '.4',
            transition: 'all .25s ease-in',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        '& .next': {
            float: 'right',
            // top: "0",
            color: '#fff',
            // fontSize: '26px',
            // bottom: '0',
            // marginTop: '0',
            // padding: '5px',
            height: '100%',
            opecity: '.4',
            transition: 'all .25s ease-in',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        '& .prev:hover': {
            backgroundColor: '#fafafa',
        },
        '& .next:hover': {
            backgroundColor: '#fafafa',
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
    },
    controlDots: {
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        listStyle: 'none',
        margin: '10px 0',
        zIndex: '1',
        bottom: '0',
    },
    controlDot: {
        transition: 'opacity .25s ease-in',
        opacity: '.3',
        filter: 'alpha(opacity=30)',
        boxShadow: '1px 1px 2px rgb(0 0 0 / 90%)',
        background: '#fff',
        borderRadius: '50%',
        width: '8px',
        height: '8px',
        cursor: 'pointer',
        display: 'inline-block',
        margin: '0 8px',
        '&:hover': {
            opacity: '1'
        },
        '&.selected': {
            opacity: '1'
        }
    }
}))
export interface CarouselProps {
    children?: ReactNode,
    // containerUniqueId: string
    sideControl?: boolean,
    dotControl?: boolean,
    autoSlide?: boolean,
    slideInterval?: number,
    blurred?: boolean
}
export const Carousel = (props: CarouselProps) => {
    // const { children, containerUniqueId } = props;
    const { children, sideControl = false, dotControl = false, autoSlide = false, slideInterval = 3000
        , blurred = false } = props;
    // const [items, setItems] = useState(children)
    const classes = useStyles({ itemOpacity: blurred ? '.4' : '1' });
    // const containerUniqueId = `carousel_container_${(Math.random() + 1).toString(36).substring(7)}`
    const sliderClassName = 'slider'
    const itemClassName = 'item'
    const containerRef = useRef<HTMLDivElement>(null)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const [state, setState] = useState({
        // maxXOffset: 0,
        // minXOffset: 0,
        carouselIdx: 0,
        //????????? ???????????? ??????
        initialTransX: 0
    })
    // const [sideControl, dotControl] = [false, false]

    // page initialize (????????? ????????? ????????? ?????? initialTransX ??? ?????? ??????)
    // 6??? ????????? 3?????? ???????????? ??????
    useEffect(() => {
        if (Array.isArray(children)) {
            const len = children.length
            if (children.length % 2 === 0) {
                const transRatio = 100 / len
                setState({ ...state, initialTransX: transRatio / 2 })
                const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
                slider?.setAttribute('style', `transform: translate3d(${transRatio / 2}%, 0px, 0px); transition-duration: 350ms;`)
                // transferSlider(len,0)
            }
        }
    }, [children])

    function getMaxIdx(len: number) {
        return len % 2 === 0 ? Math.floor(len / 2) - 1 : Math.floor(len / 2);
    }
    function getMinIdx(len: number) {
        return -Math.floor(len / 2)
    }
    //auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            if (autoSlide && Array.isArray(children)) {
                const len = children.length
                const maxIdx = getMaxIdx(len)
                const minIdx = getMinIdx(len)
                var nextIdx = state.carouselIdx - 1
                if (nextIdx > maxIdx) {
                    nextIdx = minIdx
                } else if (nextIdx < minIdx) {
                    nextIdx = maxIdx
                }
                transferSlider(len, nextIdx)
            }
        }, slideInterval);
        return () => clearInterval(interval);
    }, [autoSlide, slideInterval, state])

    const transferSlider = useCallback((len: number, nextIdx: number) => {
        console.log('slide change', len, nextIdx)
        const transRatio = 100 / len
        const finalTransferX = state.initialTransX + (transRatio * (nextIdx))
        const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
        slider?.setAttribute('style', `transform: translate3d(${finalTransferX}%, 0px, 0px); transition-duration: 350ms;`)
        setState({ ...state, carouselIdx: nextIdx })

        // const items = slider?.querySelectorAll(`.${itemClassName}`)
        // console.log(items)
        // if (items) {
        // console.log('hi',items[0].classList,items[0].classList.add('selected'))
        // items[0].classList.add('selected')
        // }
    }, [state, children])

    const detectSelected = useCallback((len: number, idx: number) => {
        return len % 2 === 0 ?
            (len - 1 - idx) === state.carouselIdx + Math.floor(len / 2) - 1 ? 'selected' : ''
            : (len - 1 - idx) === state.carouselIdx + Math.floor(len / 2) ? 'selected' : ''
    }, [state])

    const prevCallback = useCallback(() => {
        if (Array.isArray(children)) {
            const len = children.length
            // const nextIdx = Math.min(state.carouselIdx + 1, len % 2 === 0 ? Math.floor(len / 2) - 1 : Math.floor(len / 2))
            const nextIdx = Math.min(state.carouselIdx + 1, getMaxIdx(len))
            // const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
            // if (slider)
            // transferSlider(len, nextIdx, slider)
            transferSlider(len, nextIdx)
        }
        // setItems([items[1], items[2], items[3], items[4], items[0]])
        // const filtered = items.filter((item, idx) => { if (idx !== items.length - 1) return true })
        // setItems([items[items.length - 1], ...filtered])
        // }

    }, [state, children])
    const nextCallback = useCallback(() => {
        if (Array.isArray(children)) {
            const len = children.length
            // const nextIdx = state.carouselIdx - 1
            // const nextIdx = Math.max(state.carouselIdx - 1, -Math.floor(len / 2))
            const nextIdx = Math.max(state.carouselIdx - 1, getMinIdx(len))
            // const slider = containerRef.current?.querySelector(`.${sliderClassName}`)
            // if (slider)
            // transferSlider(len, nextIdx, slider)
            transferSlider(len, nextIdx)
        }
        // if (Array.isArray(items)) {
        // const filtered = items.filter((item, idx) => { if (idx !== 0) return true })
        // setItems([...filtered, items[0]])
        // }
    }, [state, children])

    return (<>

        {/* <div className={`${containerUniqueKey} ${classes.container}`}> */}
        <div style={{ position: 'relative' }}>
            <div>
                <ul className={`${classes.controlDots}`}>
                    {dotControl &&
                        // Array.isArray(children) ?
                        //     children.map((child, index) => {
                        Array.isArray(children) ?
                        children.map((child, index) => {
                            // return (<li key={index} className={`${classes.controlDot}`}></li>)
                            return (
                                <li
                                    key={index}
                                    // className={
                                    //     `${classes.controlDot} 
                                    //         ${children.length % 2 === 0 ?
                                    //         (children.length - 1 - index) === state.carouselIdx + Math.floor(children.length / 2) - 1 ? 'selected' : ''
                                    //         : (children.length - 1 - index) === state.carouselIdx + Math.floor(children.length / 2) ? 'selected' : ''}
                                    //     `
                                    // }
                                    className={
                                        `${classes.controlDot} ${detectSelected(children.length, index)}`
                                    }
                                    onClick={() => { transferSlider(children.length, (children.length - 1 - index) - Math.floor(children.length / 2)) }}
                                ></li>
                            )
                            // return (<li key={index} className={`${classes.item}`}>{child}</li>)
                        })
                        :
                        (<></>)
                    }
                </ul>
            </div>
            <div className={`${classes.container}`} ref={containerRef}>
                <div className={`${sliderClassName} ${classes.slider}`}>
                    {/* <ul className={`${classes.slider}`}> */}
                    {
                        // Array.isArray(children) ?
                        //     children.map((child, index) => {
                        Array.isArray(children) ?
                            children.map((child, index) => {
                                return (
                                    <div key={index}
                                        className={`${blurred ? classes.itemBlurred : ''} ${itemClassName} ${classes.item} ${detectSelected(children.length, index)}`}
                                    // style={{opacity:`${blurred === true? '.4':'1'}`}}
                                    >
                                        {child}
                                    </div>
                                )
                                // return (<li key={index} className={`${classes.item}`}>{child}</li>)
                            })
                            :
                            (<></>)

                    }
                </div>
            </div>
            {sideControl && <div className={`${classes.controls}`}>
                <button className="prev" ref={prevRef} onClick={prevCallback}>{'<'}</button>
                {/* <div className={`${classes.progressBar}`}></div> */}
                <button className="next" ref={nextRef} onClick={nextCallback}>{'>'}</button>
            </div>}
        </div>
    </>)
}

export default Carousel;