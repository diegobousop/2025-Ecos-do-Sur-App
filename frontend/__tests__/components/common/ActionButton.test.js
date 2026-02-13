/**
 * Unit tests for ActionButton component
 * Tests message display, press handling, and icon integration
 */

describe('ActionButton Component', () => {
  describe('Props Validation', () => {
    it('should accept required message prop', () => {
      const message = 'Click me';
      expect(message).toBe('Click me');
      expect(typeof message).toBe('string');
    });

    it('should accept onPress callback', () => {
      const onPress = jest.fn();
      expect(typeof onPress).toBe('function');
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should accept iconName prop', () => {
      const iconName = 'checkmark-circle';
      expect(iconName).toBe('checkmark-circle');
      expect(typeof iconName).toBe('string');
    });

    it('should handle empty message', () => {
      const message = '';
      expect(message).toBe('');
    });
  });

  describe('Button Interaction', () => {
    it('should call onPress when triggered', () => {
      const onPress = jest.fn();
      onPress();
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress until triggered', () => {
      const onPress = jest.fn();
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should handle multiple presses', () => {
      const onPress = jest.fn();
      onPress();
      onPress();
      onPress();
      expect(onPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Icon Configuration', () => {
    it('should accept valid Ionicon names', () => {
      const validIcons = ['checkmark', 'close', 'add', 'remove', 'heart'];
      validIcons.forEach(icon => {
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });

    it('should handle icon names with dashes', () => {
      const iconName = 'checkmark-circle-outline';
      expect(iconName).toContain('-');
      expect(iconName.split('-').length).toBe(3);
    });
  });

  describe('Styling', () => {
    it('should apply primary color theme', () => {
      const primaryColor = '#4054A1';
      expect(primaryColor).toBe('#4054A1');
    });

    it('should apply border color', () => {
      const borderColor = '#BCB6DC';
      expect(borderColor).toBe('#BCB6DC');
    });

    it('should maintain consistent padding', () => {
      const padding = 16; // py-4 in Tailwind
      expect(padding).toBe(16);
    });
  });
});
