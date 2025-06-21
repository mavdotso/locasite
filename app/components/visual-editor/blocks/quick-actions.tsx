import React from "react";
import { ComponentConfig } from "../types";
import { 
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Mail,
  ArrowUp
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

// Quick Actions Bar - Floating contact buttons
const QuickActionsBarComponent: React.FC<{
  position?: string;
  style?: string;
  showPhone?: string;
  showDirections?: string;
  showBooking?: string;
  showWhatsApp?: string;
  showEmail?: string;
  bookingLink?: string;
  showOnMobile?: string;
  showOnDesktop?: string;
  business?: Doc<"businesses">;
}> = (props) => {
  const { 
    position, 
    style, 
    showPhone, 
    showDirections, 
    showBooking, 
    showWhatsApp,
    showEmail,
    bookingLink,
    showOnMobile,
    showOnDesktop,
    business: businessData
  } = props;
  
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const actions = [];
  
  if (showPhone === "yes" && businessData?.phone) {
    actions.push({
      icon: Phone,
      label: "Call",
      href: `tel:${businessData.phone}`,
      color: "bg-green-600 hover:bg-green-700"
    });
  }
  
  if (showDirections === "yes" && businessData?.address) {
    actions.push({
      icon: MapPin,
      label: "Directions",
      href: `https://maps.google.com/?q=${encodeURIComponent(businessData.address)}`,
      color: "bg-blue-600 hover:bg-blue-700"
    });
  }
  
  if (showBooking === "yes" && bookingLink) {
    actions.push({
      icon: Calendar,
      label: "Book",
      href: bookingLink,
      color: "bg-purple-600 hover:bg-purple-700"
    });
  }
  
  if (showWhatsApp === "yes" && businessData?.phone) {
    const whatsappNumber = businessData.phone.replace(/[^0-9]/g, '');
    actions.push({
      icon: MessageCircle,
      label: "WhatsApp",
      href: `https://wa.me/${whatsappNumber}`,
      color: "bg-green-500 hover:bg-green-600"
    });
  }
  
  if (showEmail === "yes" && businessData?.email) {
    actions.push({
      icon: Mail,
      label: "Email",
      href: `mailto:${businessData.email}`,
      color: "bg-muted-foreground hover:bg-muted-foreground/80"
    });
  }
  
  if (actions.length === 0) return null;
  
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
  };
  
  const visibilityClasses = cn(
    showOnMobile === "no" && "hidden md:flex",
    showOnDesktop === "no" && "md:hidden"
  );
  
  if (style === "bar") {
    return (
      <div className={cn(
        "fixed z-40",
        positionClasses[position as keyof typeof positionClasses],
        visibilityClasses
      )}>
        <div className="bg-background border rounded-full shadow-lg p-2 flex gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors",
                  action.color
                )}
                aria-label={action.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    );
  }
  
  if (style === "fab") {
    return (
      <div className={cn(
        "fixed z-40",
        positionClasses[position as keyof typeof positionClasses],
        visibilityClasses,
        "flex flex-col-reverse gap-2 items-end"
      )}>
        {isExpanded && actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <a
              key={index}
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform",
                action.color,
                "animate-in slide-in-from-bottom-2 fade-in duration-200"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              aria-label={action.label}
            >
              <Icon className="w-6 h-6" />
            </a>
          );
        })}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center transition-transform",
            isExpanded && "rotate-45"
          )}
          aria-label="Quick actions menu"
        >
          <Phone className="w-7 h-7" />
        </button>
      </div>
    );
  }
  
  // Floating style (default)
  return (
    <div className={cn(
      "fixed z-40",
      positionClasses[position as keyof typeof positionClasses],
      visibilityClasses,
      "flex flex-col gap-3"
    )}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <a
            key={index}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110",
              action.color
            )}
            aria-label={action.label}
          >
            <Icon className="w-6 h-6" />
          </a>
        );
      })}
    </div>
  );
};

export const QuickActionsBar: ComponentConfig = {
  fields: {
    position: {
      type: "select",
      label: "Position",
      defaultValue: "bottom-right",
      options: [
        { value: "bottom-right", label: "Bottom Right" },
        { value: "bottom-left", label: "Bottom Left" },
        { value: "bottom-center", label: "Bottom Center" }
      ]
    },
    style: {
      type: "select",
      label: "Style",
      defaultValue: "floating",
      options: [
        { value: "floating", label: "Floating Buttons" },
        { value: "bar", label: "Action Bar" },
        { value: "fab", label: "FAB Menu" }
      ]
    },
    showPhone: {
      type: "select",
      label: "Show Phone",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showDirections: {
      type: "select",
      label: "Show Directions",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showBooking: {
      type: "select",
      label: "Show Booking",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showWhatsApp: {
      type: "select",
      label: "Show WhatsApp",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showEmail: {
      type: "select",
      label: "Show Email",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    bookingLink: {
      type: "text",
      label: "Booking Link",
      defaultValue: "#",
      placeholder: "https://calendly.com/yourbusiness"
    },
    showOnMobile: {
      type: "select",
      label: "Show on Mobile",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    showOnDesktop: {
      type: "select",
      label: "Show on Desktop",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, _editMode, business) => {
    return <QuickActionsBarComponent {...props} business={business as Doc<"businesses"> | undefined} />;
  },
  icon: Phone,
  category: "Mobile"
};

// Mobile Click-to-Call Bar
export const MobileCallBar: ComponentConfig = {
  fields: {
    text: {
      type: "text",
      label: "Call Text",
      defaultValue: "Call Now"
    },
    position: {
      type: "select",
      label: "Position",
      defaultValue: "bottom",
      options: [
        { value: "bottom", label: "Bottom" },
        { value: "top", label: "Top" }
      ]
    },
    showIcon: {
      type: "select",
      label: "Show Icon",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    },
    backgroundColor: {
      type: "color",
      label: "Background Color",
      defaultValue: "#10b981"
    },
    showOnDesktop: {
      type: "select",
      label: "Show on Desktop",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" }
      ]
    }
  },
  render: (props, _editMode, business) => {
    const { text, position, showIcon, backgroundColor, showOnDesktop } = props as {
      text?: string;
      position?: string;
      showIcon?: string;
      backgroundColor?: string;
      showOnDesktop?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;
    
    if (!businessData?.phone) return null;
    
    const positionClasses = position === "top" ? "top-0" : "bottom-0";
    const visibilityClasses = showOnDesktop === "no" ? "md:hidden" : "";
    
    return (
      <div className={cn(
        "fixed left-0 right-0 z-40",
        positionClasses,
        visibilityClasses
      )}>
        <a
          href={`tel:${businessData.phone}`}
          className="block w-full py-4 text-center text-white font-medium shadow-lg"
          style={{ backgroundColor: backgroundColor || "#10b981" }}
        >
          {showIcon === "yes" && <Phone className="w-5 h-5 inline-block mr-2" />}
          {text || "Call Now"}: {businessData.phone}
        </a>
      </div>
    );
  },
  icon: Phone,
  category: "Mobile"
};

// Back to Top Button Component
const BackToTopButtonComponent: React.FC<{
  style?: string;
  position?: string;
  showAfter?: number;
  backgroundColor?: string;
}> = (props) => {
  const { style, position, showAfter = 300, backgroundColor } = props;
  
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [showAfter]);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  if (!isVisible) return null;
  
  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8"
  };
  
  const styleClasses = {
    circle: "w-12 h-12 rounded-full",
    square: "w-12 h-12 rounded-lg",
    text: "px-4 py-2 rounded-lg"
  };
  
  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed z-40 flex items-center justify-center shadow-lg transition-all hover:scale-110",
        positionClasses[position as keyof typeof positionClasses],
        styleClasses[style as keyof typeof styleClasses],
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "animate-in fade-in slide-in-from-bottom-4 duration-300"
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
      aria-label="Back to top"
    >
      {style === "text" ? (
        <>
          <ArrowUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Top</span>
        </>
      ) : (
        <ArrowUp className="w-5 h-5" />
      )}
    </button>
  );
};

// Back to Top Button
export const BackToTopButton: ComponentConfig = {
  fields: {
    style: {
      type: "select",
      label: "Button Style",
      defaultValue: "circle",
      options: [
        { value: "circle", label: "Circle" },
        { value: "square", label: "Square" },
        { value: "text", label: "Text" }
      ]
    },
    position: {
      type: "select",
      label: "Position",
      defaultValue: "bottom-right",
      options: [
        { value: "bottom-right", label: "Bottom Right" },
        { value: "bottom-left", label: "Bottom Left" }
      ]
    },
    showAfter: {
      type: "number",
      label: "Show After (px)",
      defaultValue: 300,
      min: 100,
      max: 1000,
      step: 50
    },
    backgroundColor: {
      type: "color",
      label: "Background Color",
      defaultValue: ""
    }
  },
  render: (props) => {
    return <BackToTopButtonComponent {...props as { style?: string; position?: string; showAfter?: number; backgroundColor?: string }} />;
  },
  icon: ArrowUp,
  category: "Mobile"
};