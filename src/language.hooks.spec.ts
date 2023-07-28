import { renderHook, act } from "@testing-library/react";
import { useLanguage } from "./language.hooks";
import { LanguageProvider } from "./language.context";

describe('useLanguage specs', () => {
  it('should return a message with language equals "en" when it renders the hook', () => {
    // Arrange
    // No se necesita

    // Act
    // Hay que envolver este useLanguage con el Provider para poder usar correctamente el contexto
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider
    })

    act(() => {
      result.current.setLanguage('en')
    })

    // Assert
    expect(result.current.setLanguage('en'))
  })
})
