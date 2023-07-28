import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin } from './login.hooks';
import { User } from 'model';
import * as api from './api';

describe('useLogin specs', () => {
  // Probamos que tenemos un objeto con los valores iniciales
  it('should return an object: credential with default values and setCredential a function when it calls it', () => {
    // Arrange
    // No necesita ningún parámetro de entrada

    // Act
    const { result } = renderHook(() => useLogin());

    // Assert
    const defaultCredential: Credential = { name: '', password: '' };
    expect(result.current.credential).toEqual(defaultCredential); // El objeto credential está dentro de current del result
    expect(result.current.setCredential).toEqual(expect.any(Function)); // De esta forma se comprueba que el método setCredential es una función
  });

  // Probamos que se hace update de las credenciales al llamar a setCredential
  it('should update credential when it calls setCredential', () => {
    // Arrange
    const newCredential = { name: 'admin', password: 'test' };

    // Act
    const { result } = renderHook(() => useLogin());

    // Hay que englobarlo aquí cuando se modifican datos que queremos guardar, si no no pasa el test
    act(() => {
      result.current.setCredential(newCredential);
    });

    // Assert
    expect(result.current.credential).toEqual(newCredential);
  });

  // Probamos que se el valor inicial del usuario es nulo como se ha definido en login.hooks.ts
  it('should return user equals null and onLogin function', () => {
    // Arrange

    // Act
    const { result } = renderHook(() => useLogin());

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.onLogin).toEqual(expect.any(Function));
  });

  // Probamos que se actualiza el valor del usuario cuando se llama a onLogin
  it('should update user when it send valid credentials using onLogin', async () => { // Hay que marcarlo como asíncrono porque tenemos una promesa en la api y eso es asíncrono, hay que esperar que se resuelva esa promesa
    // Arrange
    const adminUser: User = {
      email: 'admin@email.com',
      role: 'admin',
    };

    // stub
    const loginStub = jest.spyOn(api, 'login').mockResolvedValue(adminUser);

    // Act
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.onLogin()
    })

    // Assert
    expect(loginStub).toHaveBeenCalled()

    // Con el waitFor se espera a que se resuelvan las promesas que haya que resolver (el código asíncrono en general)
    await waitFor(() => {
      expect(result.current.user).toEqual(adminUser);
    })

  });
});
