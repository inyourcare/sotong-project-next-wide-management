import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const TestRRCarousel = () => {
    return (
        <Carousel
            // autoPlay={true}
            // emulateTouch={true}
            // infiniteLoop={true}
            showThumbs={false}
            // width="100%"
        >
            <div className="h-full w-full">
                <img src="/paros/test1.png"
                    className="w-full h-full"
                    // width={'1060px'}
                    height='500px'
                    // object-fit='contain'
                />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src="/paros/test2.jpg"
                    // width={'1060px'}
                    height='500px'
                    // object-fit='contain'
                />
                <p className="legend">Legend 2</p>
            </div>
            <div>
                <img src="/paros/test3.jpg"
                    // width={'1060px'}
                    height='500px'
                    // object-fit='contain'
                />
                <p className="legend">Legend 3</p>
            </div>
            <div>
                <img src="/paros/test4.jpg"
                    // width={'1060px'}
                    height='500px'
                    // object-fit='contain'
                />
                <p className="legend">Legend 4</p>
            </div>
            <div>
                <img src="/paros/test5.jpeg"
                    // width={'1060px'}
                    height='500px'
                    // object-fit='contain'
                />
                <p className="legend">Legend 5</p>
            </div>
        </Carousel>
    )
}
export default TestRRCarousel;