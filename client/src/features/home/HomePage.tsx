import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import Slider from "react-slick";

export default function HomePage() {
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const slider = sliderRef.current;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && slider !== null) {
        // If tab becomes hidden, pause autoplay
        slider.slickPause();
      } else if (document.visibilityState === "visible" && slider !== null) {
        // If tab becomes visible, start autoplay
        slider.slickPlay();
      }
    };

    const handlePageFocus = () => {
      if (slider !== null) {
        // If page gains focus, start autoplay
        slider.slickPlay();
      }
    };

    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Add event listener for page focus
    window.addEventListener("focus", handlePageFocus);

    return () => {
      // Remove event listeners on component unmount
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handlePageFocus);
    };
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    draggable: false,
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 1,
  };

  return (
    <>
      <Box
        position="relative"
        maxWidth="100%"
        overflow="hidden"
        maxHeight="720px"
      >
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: 250,
            left: "45%",
            transform: "translate(-30%, -50%)",
            zIndex: 2,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Welcome!
        </Typography>
        <Slider {...settings} ref={sliderRef}>
          <div style={{ position: "relative" }}>
            <img
              src="/images/hero1.jpg"
              alt="hero"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div style={overlayStyle}></div>
          </div>
          <div>
            <img
              src="/images/hero2.jpg"
              alt="hero"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div>
            <img
              src="/images/hero3.jpg"
              alt="hero"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div>
            <img
              src="/images/hero4.jpg"
              alt="hero"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </Slider>
      </Box>
    </>
  );
}
