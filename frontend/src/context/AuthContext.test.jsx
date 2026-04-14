import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { describe, test, expect, beforeEach } from 'vitest';

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('login saves user to sessionStorage', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const userData = { 
      userId: 1, 
      name: 'John Doe', 
      email: 'john@test.com',
      role: 'USER'
    };

    act(() => {
      result.current.login(userData);
    });

    expect(result.current.user).toEqual(userData);
    expect(sessionStorage.getItem('user')).toBe(JSON.stringify(userData));
  });

  test('logout removes user from sessionStorage', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const userData = { 
      userId: 1, 
      name: 'John Doe',
      email: 'john@test.com'
    };

    act(() => {
      result.current.login(userData);
    });

    expect(result.current.user).toEqual(userData);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(sessionStorage.getItem('user')).toBeNull();
  });
});
