import axiosInstance from './axios';

export async function login(email: string, password: string) {
  try {
    const response = await axiosInstance.post('/user/signIn', {
      email,
      password
    }, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: false
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}



export async function signUp(formData: any) {
  try {
    const response = await axiosInstance.post('/user/', formData, {
      headers: {
        ContentType: 'multipart/form-data',
        AuthorizationRequired: false
      }
    });

    return await response.data;

  } catch (error: any) {
    throw Error(error.response.data.error)
  }
}


export function logout() {
  // Clear user data and set authentication state to false
  return true;
}