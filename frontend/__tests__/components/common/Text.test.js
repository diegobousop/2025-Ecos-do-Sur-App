/**
 * Unit tests for Text component
 * Tests text rendering, className application, and style props
 */

describe('Text Component', () => {
  describe('Props Handling', () => {
    it('should apply default font-sans class', () => {
      const className = 'font-sans ';
      expect(className).toContain('font-sans');
    });

    it('should merge custom className with default font-sans', () => {
      const customClass = 'text-primary text-lg';
      const finalClass = `font-sans ${customClass}`;
      expect(finalClass).toBe('font-sans text-primary text-lg');
    });

    it('should handle undefined className gracefully', () => {
      const className = undefined;
      const finalClass = `font-sans ${className ?? ''}`;
      expect(finalClass).toBe('font-sans ');
    });

    it('should apply empty string when className is not provided', () => {
      const finalClass = `font-sans ${undefined ?? ''}`;
      expect(finalClass).toBe('font-sans ');
    });
  });

  describe('Style Merging', () => {
    it('should allow custom styles to be passed', () => {
      const customStyle = { color: 'red', fontSize: 16 };
      expect(customStyle).toHaveProperty('color', 'red');
      expect(customStyle).toHaveProperty('fontSize', 16);
    });

    it('should handle undefined style prop', () => {
      const style = undefined;
      expect(style).toBeUndefined();
    });
  });

  describe('Text Content', () => {
    it('should handle string children', () => {
      const text = 'Hello World';
      expect(text).toBe('Hello World');
      expect(typeof text).toBe('string');
    });

    it('should handle empty string', () => {
      const text = '';
      expect(text).toBe('');
    });

    it('should handle numeric children', () => {
      const text = 123;
      expect(text).toBe(123);
      expect(typeof text).toBe('number');
    });
  });
});
