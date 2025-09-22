/**
 * Dynamic Color Utility
 * Provides utilities for handling dynamic colors without inline styles
 */

/**
 * Get CSS custom property for dynamic colors
 * @param colorValue - The color value to convert
 * @returns CSS custom property object
 */
export function getDynamicColorStyle(colorValue: string): React.CSSProperties {
  return {
    '--dynamic-color': colorValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic background colors
 * @param colorValue - The background color value to convert
 * @returns CSS custom property object
 */
export function getDynamicBackgroundStyle(colorValue: string): React.CSSProperties {
  return {
    '--dynamic-bg': colorValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic text colors
 * @param colorValue - The text color value to convert
 * @returns CSS custom property object
 */
export function getDynamicTextStyle(colorValue: string): React.CSSProperties {
  return {
    '--dynamic-text': colorValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic border colors
 * @param colorValue - The border color value to convert
 * @returns CSS custom property object
 */
export function getDynamicBorderStyle(colorValue: string): React.CSSProperties {
  return {
    '--dynamic-border': colorValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic width
 * @param widthValue - The width value (number or string)
 * @returns CSS custom property object
 */
export function getDynamicWidthStyle(widthValue: number | string): React.CSSProperties {
  return {
    '--dynamic-width': typeof widthValue === 'number' ? `${widthValue}%` : widthValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic height
 * @param heightValue - The height value (number or string)
 * @returns CSS custom property object
 */
export function getDynamicHeightStyle(heightValue: number | string): React.CSSProperties {
  return {
    '--dynamic-height': typeof heightValue === 'number' ? `${heightValue}px` : heightValue,
  } as React.CSSProperties;
}

/**
 * Get CSS custom property for dynamic transform
 * @param transformValue - The transform value
 * @returns CSS custom property object
 */
export function getDynamicTransformStyle(transformValue: string): React.CSSProperties {
  return {
    '--dynamic-transform': transformValue,
  } as React.CSSProperties;
}
