import axiosInstance from './axios';

export async function getAllTypesDocument() {
  try {
    const response = await axiosInstance.get('/typedocument', {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 200) {
      throw new Error('Error fetching type documents');
    }
    const { data } = await response.data;
    return data;

  } catch (error) {
    console.error('Login failed:', error);
  }
}

export async function removeTypeDocument(id: string) {
  try {
    const response = await axiosInstance.delete(`typedocument/${id}`, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 200) {
      throw new Error('Error deleting type document');
    }
    return await response;

  } catch (error: any) {
    return Error(error.Error)
  }
}

export async function newTypeDocument(name: string, extension: string) {
  try {
    const response = await axiosInstance.post(`typedocument/`, {
      name,
      extension
    }, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    if (response.status != 201) {
      throw new Error('Error creating new type document');
    }

    return await response;

  } catch (error) {
    console.error('Error:', error);
  }
}