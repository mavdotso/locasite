import React from "react";
import { Button } from "@/app/components/ui/button";
import { ComponentVariation } from "../types";

// Hero Variation 1: Classic Center
export const heroClassicCenter: ComponentVariation = {
  id: "classic-center",
  name: "Classic Center",
  description: "Centered content with background image",
  defaultProps: {
    title: "Welcome to Our Business",
    subtitle: "Providing quality services since 2020",
    buttonText: "Get Started",
    buttonLink: "#contact",
    backgroundImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920",
    overlay: true,
    overlayOpacity: 0.5,
    height: "600px",
    alignment: "center",
  },
  render: (props) => (
    <section
      className="relative flex items-center justify-center text-white"
      style={{
        height: props.height as string,
        backgroundImage: `url(${props.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {(props.overlay as boolean) && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: props.overlayOpacity as number }}
        />
      )}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {props.title as string}
        </h1>
        <p className="text-xl md:text-2xl mb-8">{props.subtitle as string}</p>
        {props.buttonText ? (
          <Button size="lg" className="text-lg px-8">
            {props.buttonText as string}
          </Button>
        ) : null}
      </div>
    </section>
  ),
};

// Hero Variation 2: Split Layout
export const heroSplitLayout: ComponentVariation = {
  id: "split-layout",
  name: "Split Layout",
  description: "Content on one side, image on the other",
  defaultProps: {
    title: "Professional Services You Can Trust",
    subtitle: "We deliver excellence in every project",
    buttonText: "Learn More",
    buttonLink: "#services",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800",
    imagePosition: "right",
    backgroundColor: "#f8f9fa",
  },
  render: (props) => {
    const imageOnRight = props.imagePosition === "right";

    return (
      <section
        className="min-h-[600px] flex items-center"
        style={{ backgroundColor: props.backgroundColor as string }}
      >
        <div className="container mx-auto px-4">
          <div
            className={`grid md:grid-cols-2 gap-8 items-center ${imageOnRight ? "" : "md:flex-row-reverse"}`}
          >
            <div className={imageOnRight ? "" : "md:order-2"}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {props.title as string}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {props.subtitle as string}
              </p>
              {props.buttonText ? (
                <Button size="lg">{props.buttonText as string}</Button>
              ) : null}
            </div>
            <div className={imageOnRight ? "" : "md:order-1"}>
              <img
                src={props.image as string}
                alt="Hero"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    );
  },
};

// Hero Variation 3: Minimal
export const heroMinimal: ComponentVariation = {
  id: "minimal",
  name: "Minimal",
  description: "Clean and simple with focus on typography",
  defaultProps: {
    title: "Simple. Elegant. Powerful.",
    subtitle: "Everything you need, nothing you don't",
    buttonText: "Start Now",
    buttonLink: "#start",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#3b82f6",
  },
  render: (props) => (
    <section
      className="py-24 md:py-32"
      style={{
        backgroundColor: props.backgroundColor as string,
        color: props.textColor as string,
      }}
    >
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-light mb-6">
          {props.title as string}
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-80">
          {props.subtitle as string}
        </p>
        {props.buttonText ? (
          <Button
            size="lg"
            variant="outline"
            style={{
              borderColor: props.accentColor as string,
              color: props.accentColor as string,
            }}
            className="hover:bg-opacity-10"
          >
            {props.buttonText as string}
          </Button>
        ) : null}
      </div>
    </section>
  ),
};

// Hero Variation 4: Video Background
export const heroVideoBackground: ComponentVariation = {
  id: "video-background",
  name: "Video Background",
  description: "Full-screen video with overlay content",
  defaultProps: {
    title: "Experience Innovation",
    subtitle: "Where technology meets creativity",
    buttonText: "Explore",
    buttonLink: "#explore",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    overlay: true,
    overlayOpacity: 0.6,
    height: "100vh",
  },
  render: (props) => (
    <section
      className="relative flex items-center justify-center text-white overflow-hidden"
      style={{ height: props.height as string }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={props.videoUrl as string} type="video/mp4" />
      </video>
      {(props.overlay as boolean) && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: props.overlayOpacity as number }}
        />
      )}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {props.title as string}
        </h1>
        <p className="text-2xl md:text-3xl mb-10">{props.subtitle as string}</p>
        {props.buttonText ? (
          <Button size="lg" className="text-lg px-10 py-6">
            {props.buttonText as string}
          </Button>
        ) : null}
      </div>
    </section>
  ),
};

// Hero Variation 5: Gradient Background
export const heroGradient: ComponentVariation = {
  id: "gradient",
  name: "Gradient Background",
  description: "Modern gradient with animated elements",
  defaultProps: {
    title: "Next Generation Solutions",
    subtitle: "Transform your business with cutting-edge technology",
    buttonText: "Get Started",
    buttonLink: "#start",
    gradientFrom: "#667eea",
    gradientTo: "#764ba2",
    height: "700px",
  },
  render: (props) => (
    <section
      className="relative flex items-center justify-center text-white overflow-hidden"
      style={{
        height: props.height as string,
        background: `linear-gradient(135deg, ${props.gradientFrom} 0%, ${props.gradientTo} 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          {props.title as string}
        </h1>
        <p className="text-xl md:text-2xl mb-10 animate-fade-in-delay">
          {props.subtitle as string}
        </p>
        {props.buttonText ? (
          <Button
            size="lg"
            className="text-lg px-8 bg-white text-foreground hover:bg-muted"
          >
            {props.buttonText as string}
          </Button>
        ) : null}
      </div>
    </section>
  ),
};

// Export all variations
export const heroVariations: ComponentVariation[] = [
  heroClassicCenter,
  heroSplitLayout,
  heroMinimal,
  heroVideoBackground,
  heroGradient,
];
