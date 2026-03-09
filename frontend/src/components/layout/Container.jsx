import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "@/styles/container.css";

const Container = forwardRef(
  (
    {
      children,
      className = "",
      fluid = false,
      size = null,
      noPadding = false,
      as: Component = "div",
      role = "region",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const containerClasses = clsx(
      !fluid && "container",
      fluid && "container-fluid",
      size && `container-${size}`,
      noPadding && "container-no-padding",
      className,
    );

    return (
      <Component
        ref={ref}
        className={containerClasses}
        role={role}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Container.displayName = "Container";

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fluid: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "xxl", null]),
  noPadding: PropTypes.bool,
  as: PropTypes.elementType,
  role: PropTypes.string,
  "aria-label": PropTypes.string,
};

Container.defaultProps = {
  className: "",
  fluid: false,
  size: null,
  noPadding: false,
  as: "div",
  role: "region",
  "aria-label": undefined,
};

export default Container;