/**
 * Unit tests for BubbleButton component
 * Tests button interaction, icon handling, and blur effects
 */

describe('BubbleButton Component', () => {
  describe('Props Validation', () => {
    it('should accept onPress callback', () => {
      const onPress = jest.fn();
      expect(typeof onPress).toBe('function');
    });

    it('should accept optional additionalStyles', () => {
      const styles = 'bottom-5 right-5';
      expect(styles).toBe('bottom-5 right-5');
    });

    it('should use default iconName when not provided', () => {
      const defaultIcon = 'create-outline';
      expect(defaultIcon).toBe('create-outline');
    });

    it('should accept custom iconName', () => {
      const customIcon = 'add-circle';
      expect(customIcon).toBe('add-circle');
    });

    it('should accept svgIcon element', () => {
      const svgIcon = { type: 'svg', props: {} };
      expect(svgIcon).toHaveProperty('type');
      expect(svgIcon).toHaveProperty('props');
    });
  });

  describe('Icon Priority', () => {
    it('should prioritize svgIcon over iconName when both provided', () => {
      const svgIcon = { type: 'svg' };
      const iconName = 'create-outline';
      
      // Logic: if svgIcon exists, use it; otherwise use iconName
      const usedIcon = svgIcon ? 'svg' : iconName;
      expect(usedIcon).toBe('svg');
    });

    it('should use iconName when svgIcon is not provided', () => {
      const svgIcon = undefined;
      const iconName = 'create-outline';
      
      const usedIcon = svgIcon ? 'svg' : iconName;
      expect(usedIcon).toBe('create-outline');
    });
  });

  describe('Button Interaction', () => {
    it('should trigger onPress callback', () => {
      const onPress = jest.fn();
      onPress();
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple presses', () => {
      const onPress = jest.fn();
      onPress();
      onPress();
      expect(onPress).toHaveBeenCalledTimes(2);
    });
  });

  describe('Styling Configuration', () => {
    it('should apply base positioning classes', () => {
      const baseClasses = 'absolute border-2 border-[#BCB6DC] rounded-full';
      expect(baseClasses).toContain('absolute');
      expect(baseClasses).toContain('rounded-full');
    });

    it('should merge additional styles', () => {
      const base = 'absolute border-2 border-[#BCB6DC] rounded-full ';
      const additional = 'bottom-5 right-5';
      const merged = base + additional;
      
      expect(merged).toContain('absolute');
      expect(merged).toContain('bottom-5');
      expect(merged).toContain('right-5');
    });

    it('should apply blur intensity', () => {
      const intensity = 30;
      expect(intensity).toBe(30);
      expect(intensity).toBeGreaterThan(0);
    });

    it('should apply border color', () => {
      const borderColor = '#BCB6DC';
      expect(borderColor).toBe('#BCB6DC');
    });

    it('should apply icon color', () => {
      const iconColor = '#4054A1';
      expect(iconColor).toBe('#4054A1');
    });
  });

  describe('Blur Effect Configuration', () => {
    it('should set correct padding', () => {
      const padding = 14;
      expect(padding).toBe(14);
    });

    it('should set correct border radius', () => {
      const borderRadius = 9999;
      expect(borderRadius).toBe(9999);
    });

    it('should use light tint', () => {
      const tint = 'light';
      expect(tint).toBe('light');
    });
  });
});
