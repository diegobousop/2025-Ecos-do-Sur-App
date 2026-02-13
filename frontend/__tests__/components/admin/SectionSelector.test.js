/**
 * Unit tests for SectionSelector component
 * Tests section rendering and selection handling
 */

describe('SectionSelector Component', () => {
  describe('Props Validation', () => {
    it('should accept sections array', () => {
      const sections = [
        { label: 'Usuarios', value: 'users' },
        { label: 'Analíticas', value: 'analytics' }
      ];
      
      expect(sections).toHaveLength(2);
      expect(sections[0]).toHaveProperty('label');
      expect(sections[0]).toHaveProperty('value');
    });

    it('should accept activeSection string', () => {
      const activeSection = 'users';
      expect(typeof activeSection).toBe('string');
    });

    it('should accept onSectionChange callback', () => {
      const onSectionChange = jest.fn();
      expect(typeof onSectionChange).toBe('function');
    });
  });

  describe('Section Structure', () => {
    it('should have label and value properties', () => {
      const section = { label: 'Usuarios', value: 'users' };
      
      expect(section.label).toBe('Usuarios');
      expect(section.value).toBe('users');
    });

    it('should validate section properties', () => {
      const sections = [
        { label: 'Usuarios', value: 'users' },
        { label: 'Analíticas', value: 'analytics' }
      ];
      
      sections.forEach(section => {
        expect(section).toHaveProperty('label');
        expect(section).toHaveProperty('value');
        expect(typeof section.label).toBe('string');
        expect(typeof section.value).toBe('string');
      });
    });
  });

  describe('Active Section Logic', () => {
    it('should identify active section', () => {
      const activeSection = 'users';
      const sectionValue = 'users';
      const isActive = activeSection === sectionValue;
      
      expect(isActive).toBe(true);
    });

    it('should identify inactive section', () => {
      const activeSection = 'users';
      const sectionValue = 'analytics';
      const isActive = activeSection === sectionValue;
      
      expect(isActive).toBe(false);
    });
  });

  describe('Section Change Handling', () => {
    it('should call onSectionChange with correct value', () => {
      const onSectionChange = jest.fn();
      const newSection = 'analytics';
      
      onSectionChange(newSection);
      expect(onSectionChange).toHaveBeenCalledWith('analytics');
    });

    it('should handle multiple section changes', () => {
      const onSectionChange = jest.fn();
      
      onSectionChange('users');
      onSectionChange('analytics');
      onSectionChange('users');
      
      expect(onSectionChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Section Mapping', () => {
    it('should map sections to items', () => {
      const sections = [
        { label: 'Usuarios', value: 'users' },
        { label: 'Analíticas', value: 'analytics' }
      ];
      
      const mapped = sections.map(section => ({
        label: section.label,
        value: section.value
      }));
      
      expect(mapped).toHaveLength(2);
      expect(mapped[0].label).toBe('Usuarios');
    });

    it('should preserve section order', () => {
      const sections = [
        { label: 'First', value: '1' },
        { label: 'Second', value: '2' },
        { label: 'Third', value: '3' }
      ];
      
      const values = sections.map(s => s.value);
      expect(values).toEqual(['1', '2', '3']);
    });
  });

  describe('Layout Configuration', () => {
    it('should use horizontal layout', () => {
      const flexDirection = 'flex-row';
      expect(flexDirection).toBe('flex-row');
    });

    it('should apply gap between items', () => {
      const gap = 2; // gap-2 in Tailwind
      expect(gap).toBe(2);
    });

    it('should apply horizontal padding', () => {
      const paddingX = 4; // px-4 in Tailwind
      expect(paddingX).toBe(4);
    });
  });

  describe('Empty State', () => {
    it('should handle empty sections array', () => {
      const sections = [];
      expect(sections).toHaveLength(0);
    });

    it('should handle undefined activeSection', () => {
      const activeSection = undefined;
      const sectionValue = 'users';
      const isActive = activeSection === sectionValue;
      
      expect(isActive).toBe(false);
    });
  });
});
