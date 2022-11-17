
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
const TestCarousel = () => {
    return (
        <Carousel
            swipeable={true}
            draggable={true}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            // autoPlay={this.props.deviceType !== "mobile" ? true : false}
            autoPlay={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            // deviceType={this.props.deviceType}
            deviceType={'desktop'}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            <div>
                <img src="/paros/test1.png"
                    // width={'1060px'}
                    height='500px'
                    object-fit='contain'
                />
            </div>
            <div>
                <img src="/paros/test2.jpg"
                    // width={'1060px'}
                    height='500px'
                    object-fit='contain'
                />
            </div>
            <div>
                <img src="/paros/test3.jpg"
                    // width={'1060px'}
                    height='500px'
                    object-fit='contain'
                />
            </div>
            <div>
                <img src="/paros/test4.jpg"
                    // width={'1060px'}
                    height='500px'
                    object-fit='contain'
                />
            </div>
            <div>
                <img src="/paros/test5.jpeg"
                    // width={'1060px'}
                    height='500px'
                    object-fit='contain'
                />
            </div>
        </Carousel>
    )
}
export default TestCarousel;