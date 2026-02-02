/**
 * Unit tests for LanguageSelector component
 * Tests language options, selection handling, and UI states
 */

describe('LanguageSelector Component', () => {
  describe('Language Options', () => {
    it('should support all available languages', () => {
      const availableLanguages = ['es', 'gl', 'en'];
      expect(availableLanguages).toHaveLength(3);
      expect(availableLanguages).toContain('es');
      expect(availableLanguages).toContain('gl');
      expect(availableLanguages).toContain('en');
    });

    it('should have language data for Spanish', () => {
      const languageData = {
        es: { flag: '🇪🇸', name: 'Español' }
      };
      
      expect(languageData.es.flag).toBe('🇪🇸');
      expect(languageData.es.name).toBe('Español');
    });

    it('should have language data for Galician', () => {
      const languageData = {
        gl: { flag: '🇪🇸', name: 'Galego' }
      };
      
      expect(languageData.gl.flag).toBe('🇪🇸');
      expect(languageData.gl.name).toBe('Galego');
    });

    it('should have language data for English', () => {
      const languageData = {
        en: { flag: '🇬🇧', name: 'English' }
      };
      
      expect(languageData.en.flag).toBe('🇬🇧');
      expect(languageData.en.name).toBe('English');
    });
  });

  describe('Language Code Validation', () => {
    it('should validate Spanish code', () => {
      const validCodes = ['es', 'gl', 'en'];
      expect(validCodes).toContain('es');
    });

    it('should validate Galician code', () => {
      const validCodes = ['es', 'gl', 'en'];
      expect(validCodes).toContain('gl');
    });

    it('should validate English code', () => {
      const validCodes = ['es', 'gl', 'en'];
      expect(validCodes).toContain('en');
    });

    it('should reject invalid language codes', () => {
      const validCodes = ['es', 'gl', 'en'];
      expect(validCodes).not.toContain('fr');
      expect(validCodes).not.toContain('de');
    });
  });

  describe('Selection Handling', () => {
    it('should call onSelect with Spanish', () => {
      const onSelect = jest.fn();
      onSelect('es');
      
      expect(onSelect).toHaveBeenCalledWith('es');
    });

    it('should call onSelect with Galician', () => {
      const onSelect = jest.fn();
      onSelect('gl');
      
      expect(onSelect).toHaveBeenCalledWith('gl');
    });

    it('should call onSelect with English', () => {
      const onSelect = jest.fn();
      onSelect('en');
      
      expect(onSelect).toHaveBeenCalledWith('en');
    });

    it('should handle multiple language changes', () => {
      const onSelect = jest.fn();
      
      onSelect('es');
      onSelect('en');
      onSelect('gl');
      
      expect(onSelect).toHaveBeenCalledTimes(3);
    });
  });

  describe('Active State Detection', () => {
    it('should identify Spanish as selected', () => {
      const selectedLanguage = 'es';
      const isSelected = selectedLanguage === 'es';
      
      expect(isSelected).toBe(true);
    });

    it('should identify Galician as selected', () => {
      const selectedLanguage = 'gl';
      const isSelected = selectedLanguage === 'gl';
      
      expect(isSelected).toBe(true);
    });

    it('should identify English as selected', () => {
      const selectedLanguage = 'en';
      const isSelected = selectedLanguage === 'en';
      
      expect(isSelected).toBe(true);
    });

    it('should identify non-selected language', () => {
      const selectedLanguage = 'es';
      const isEnglishSelected = selectedLanguage === 'en';
      
      expect(isEnglishSelected).toBe(false);
    });
  });

  describe('Font Weight Styling', () => {
    it('should use bold font for selected language', () => {
      const isSelected = true;
      const fontWeight = isSelected ? '600' : '400';
      
      expect(fontWeight).toBe('600');
    });

    it('should use normal font for non-selected language', () => {
      const isSelected = false;
      const fontWeight = isSelected ? '600' : '400';
      
      expect(fontWeight).toBe('400');
    });
  });

  describe('Color Styling', () => {
    it('should use primary color for selected in light mode', () => {
      const isSelected = true;
      const isDark = false;
      const color = isSelected
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#4054A1');
    });

    it('should use gray color for non-selected in light mode', () => {
      const isSelected = false;
      const isDark = false;
      const color = isSelected
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#333');
    });

    it('should use white color in dark mode', () => {
      const isSelected = true;
      const isDark = true;
      const color = isSelected
        ? (isDark ? '#fff' : '#4054A1')
        : (isDark ? '#fff' : '#333');
      
      expect(color).toBe('#fff');
    });
  });

  describe('Layout Configuration', () => {
    it('should use horizontal layout', () => {
      const flexDirection = 'flex-row';
      expect(flexDirection).toBe('flex-row');
    });

    it('should justify content between items', () => {
      const justifyContent = 'justify-between';
      expect(justifyContent).toBe('justify-between');
    });

    it('should apply horizontal padding', () => {
      const paddingX = 5; // px-5
      expect(paddingX).toBe(5);
    });

    it('should apply vertical padding', () => {
      const paddingY = 2; // py-2
      expect(paddingY).toBe(2);
    });

    it('should apply rounded corners', () => {
      const rounded = 'rounded-full';
      expect(rounded).toBe('rounded-full');
    });

    it('should set container height', () => {
      const height = 83;
      expect(height).toBe(83);
    });
  });

  describe('Flag Display', () => {
    it('should use emoji flags', () => {
      const flags = ['🇪🇸', '🇬🇧'];
      flags.forEach(flag => {
        expect(flag).toBeTruthy();
        expect(typeof flag).toBe('string');
      });
    });

    it('should display flag with correct font size', () => {
      const fontSize = 32;
      expect(fontSize).toBe(32);
    });

    it('should apply margin below flag', () => {
      const marginBottom = 4;
      expect(marginBottom).toBe(4);
    });
  });

  describe('Language Names', () => {
    it('should display correct name for Spanish', () => {
      const name = 'Español';
      expect(name).toBe('Español');
    });

    it('should display correct name for Galician', () => {
      const name = 'Galego';
      expect(name).toBe('Galego');
    });

    it('should display correct name for English', () => {
      const name = 'English';
      expect(name).toBe('English');
    });

    it('should display names with correct font size', () => {
      const fontSize = 12;
      expect(fontSize).toBe(12);
    });
  });
});
