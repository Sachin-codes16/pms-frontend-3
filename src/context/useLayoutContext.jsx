import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import useQueryParams from '@/hooks/useQueryParams';
import { toggleDocumentAttribute } from '@/utils/layout';
const ThemeContext = createContext(undefined);
const CONFIG_STORAGE_KEY = '__LAHOMES_UI_CONFIG__';
const DEFAULT_SETTINGS = {
  theme: 'light',
  topbarTheme: 'light',
  menu: {
    theme: 'dark',
    size: 'default'
  }
};
const useLayoutContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useLayoutContext can only be used within LayoutProvider');
  }
  return context;
};
const LayoutProvider = ({
  children
}) => {
  const queryParams = useQueryParams();
  const INIT_STATE = {
    theme: DEFAULT_SETTINGS.theme,
    topbarTheme: DEFAULT_SETTINGS.topbarTheme,
    menu: {
      theme: DEFAULT_SETTINGS.menu.theme,
      size: queryParams['menu_size'] ? queryParams['menu_size'] : DEFAULT_SETTINGS.menu.size
    }
  };
  const [settings, setSettings] = useLocalStorage(CONFIG_STORAGE_KEY, INIT_STATE, true);
  const [offcanvasStates, setOffcanvasStates] = useState({
    showThemeCustomizer: false,
    showActivityStream: false,
    showBackdrop: false
  });

  // update settings
  const updateSettings = _newSettings => setSettings({
    ...settings,
    ..._newSettings
  });

  // update theme mode
  const changeTheme = newTheme => {
    updateSettings({
      theme: newTheme
    });
  };

  // change topbar theme
  const changeTopbarTheme = newTheme => {
    updateSettings({
      topbarTheme: newTheme
    });
  };

  // change menu theme
  const changeMenuTheme = newTheme => {
    updateSettings({
      menu: {
        ...settings.menu,
        theme: newTheme
      }
    });
  };

  // change menu theme
  const changeMenuSize = newSize => {
    updateSettings({
      menu: {
        ...settings.menu,
        size: newSize
      }
    });
  };

  // toggle theme customizer offcanvas
  const toggleThemeCustomizer = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showThemeCustomizer: !offcanvasStates.showThemeCustomizer
    });
  };

  // toggle activity stream offcanvas
  const toggleActivityStream = () => {
    setOffcanvasStates({
      ...offcanvasStates,
      showActivityStream: !offcanvasStates.showActivityStream
    });
  };
  const themeCustomizer = {
    open: offcanvasStates.showThemeCustomizer,
    toggle: toggleThemeCustomizer
  };
  const activityStream = {
    open: offcanvasStates.showActivityStream,
    toggle: toggleActivityStream
  };

  // toggle backdrop
  const toggleBackdrop = useCallback(() => {
    const htmlTag = document.getElementsByTagName('html')[0];
    if (offcanvasStates.showBackdrop) htmlTag.classList.remove('sidebar-enable');else htmlTag.classList.add('sidebar-enable');
    setOffcanvasStates({
      ...offcanvasStates,
      showBackdrop: !offcanvasStates.showBackdrop
    });
  }, [offcanvasStates.showBackdrop]);
  
  useEffect(() => {
    toggleDocumentAttribute('data-bs-theme', settings.theme);
    toggleDocumentAttribute('data-topbar-color', settings.topbarTheme);
    toggleDocumentAttribute('data-menu-color', 'dark');
    toggleDocumentAttribute('data-menu-size', settings.menu.size);
    return () => {
      toggleDocumentAttribute('data-bs-theme', settings.theme, true);
      toggleDocumentAttribute('data-topbar-color', settings.topbarTheme, true);
      toggleDocumentAttribute('data-menu-color', 'dark', true);
      toggleDocumentAttribute('data-menu-size', settings.menu.size, true);
    };
  }, [settings]);
  const resetSettings = () => updateSettings(INIT_STATE);
  return <ThemeContext.Provider value={useMemo(() => ({
    ...settings,
    themeMode: settings.theme,
    changeTheme,
    changeTopbarTheme,
    changeMenu: {
      theme: changeMenuTheme,
      size: changeMenuSize
    },
    themeCustomizer,
    activityStream,
    toggleBackdrop,
    resetSettings
  }), [settings, offcanvasStates])}>
      {children}
      {offcanvasStates.showBackdrop && <div className="offcanvas-backdrop fade show" onClick={toggleBackdrop} />}
    </ThemeContext.Provider>;
};
export { LayoutProvider, useLayoutContext };
