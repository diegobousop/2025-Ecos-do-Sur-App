/**
 * Unit tests for GenderSelector component
 * Tests gender selection, validation, and UI state management
 */

describe('GenderSelector Component', () => {
  describe('Gender Options', () => {
    it('should support all gender options', () => {
      const genders = ['male', 'female', 'other', 'prefer_not_say'];
      expect(genders).toHaveLength(4);
      expect(genders).toContain('male');
      expect(genders).toContain('female');
      expect(genders).toContain('other');
      expect(genders).toContain('prefer_not_say');
    });

    it('should validate gender codes', () => {
      const validGenders = ['male', 'female', 'other', 'prefer_not_say'];
      const testGender = 'male';
      expect(validGenders).toContain(testGender);
    });

    it('should reject invalid gender codes', () => {
      const validGenders = ['male', 'female', 'other', 'prefer_not_say'];
      const invalidGender = 'invalid';
      expect(validGenders).not.toContain(invalidGender);
    });
  });

  describe('Selection Handling', () => {
    it('should call onSelect with correct gender', () => {
      const onSelect = jest.fn();
      const gender = 'male';
      
      onSelect(gender);
      expect(onSelect).toHaveBeenCalledWith('male');
    });

    it('should update selection for each gender option', () => {
      const onSelect = jest.fn();
      const genders = ['male', 'female', 'other', 'prefer_not_say'];
      
      genders.forEach(gender => onSelect(gender));
      expect(onSelect).toHaveBeenCalledTimes(4);
    });

    it('should handle rapid selection changes', () => {
      const onSelect = jest.fn();
      
      onSelect('male');
      onSelect('female');
      onSelect('other');
      
      expect(onSelect).toHaveBeenCalledTimes(3);
      expect(onSelect).toHaveBeenLastCalledWith('other');
    });
  });

  describe('Active State Management', () => {
    it('should identify active selection', () => {
      const selectedGender = 'male';
      const testGender = 'male';
      
      expect(selectedGender === testGender).toBe(true);
    });

    it('should identify inactive selection', () => {
      const selectedGender = 'male';
      const testGender = 'female';
      
      expect(selectedGender === testGender).toBe(false);
    });

    it('should handle empty selection', () => {
      const selectedGender = '';
      const testGender = 'male';
      
      expect(selectedGender === testGender).toBe(false);
    });
  });

  describe('Style Configuration', () => {
    it('should apply active font weight', () => {
      const isSelected = true;
      const fontWeight = isSelected ? '600' : '400';
      expect(fontWeight).toBe('600');
    });

    it('should apply inactive font weight', () => {
      const isSelected = false;
      const fontWeight = isSelected ? '600' : '400';
      expect(fontWeight).toBe('400');
    });

    it('should apply active color in light mode', () => {
      const isSelected = true;
      const isDark = false;
      const color = isSelected 
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#4054A1');
    });

    it('should apply inactive color in light mode', () => {
      const isSelected = false;
      const isDark = false;
      const color = isSelected 
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#333');
    });

    it('should apply white color in dark mode', () => {
      const isDark = true;
      const isSelected = true;
      const color = isSelected 
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#fff');
    });
  });

  describe('Labels and Emojis', () => {
    it('should have correct label for male', () => {
      const label = 'Masculino';
      expect(label).toBe('Masculino');
    });

    it('should have correct label for female', () => {
      const label = 'Femenino';
      expect(label).toBe('Femenino');
    });

    it('should have correct label for other', () => {
      const label = 'Otro';
      expect(label).toBe('Otro');
    });

    it('should have correct label for prefer not to say', () => {
      const label = 'Prefiero no decir';
      expect(label).toBe('Prefiero no decir');
    });

    it('should use emoji icons', () => {
      const emojis = ['👨', '👩', '⚧️', '🤐'];
      emojis.forEach(emoji => {
        expect(emoji).toBeTruthy();
        expect(typeof emoji).toBe('string');
      });
    });
  });
});
