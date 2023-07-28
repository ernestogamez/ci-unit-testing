import { renderHook, waitFor } from '@testing-library/react';
import { usePolling } from './polling.hooks';

describe('usePolling specs', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  // Contador es igual a 0 al iniciar el hook
  it('should return count equals 0 when initialize the hook', () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    expect(result.current.count).toEqual(0);
  });

  // El contador es 1 cuando se ha resuelto el hook -> Al usar setInterval es código asíncrono
  it('should return count equals 1 when it waits for next update', async () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    await waitFor(() => {
      // waitFor por defecto es un segundo
      expect(result.current.count).toEqual(1);
    });
  });

  // El contador es 3 cuando han pasado 3 iteraciones del hook -> Al usar setInterval es código asíncrono
  it('should return count equals 3 when it waits 3 times for next update', async () => {
    // Arrange
    const pollingTime = 500;

    // Act
    const { result } = renderHook(() => usePolling(pollingTime));

    // Assert
    await waitFor(
      () => {
        // waitFor por defecto es un segundo
        expect(result.current.count).toEqual(3);
      },
      { timeout: 2000 }
    );
  });

  // Debe llamar al método clearInterval cuando se desmonta el componente
  it('should call clearInterval when it unmounts the component', async () => {
    // Arrange
    const pollingTime = 500;

    // stub
    const stub = jest.spyOn(window, 'clearInterval'); // Podemos inspeccionar el método clearInterval directamente del objeto window aunque no esté en los imports

    // Act
    const { unmount } = renderHook(() => usePolling(pollingTime));

    // Assert
    expect(stub).not.toHaveBeenCalled();

    unmount();
    expect(stub).toHaveBeenCalled();
  });
});
