import axiosInstance from './axios';


export async function applyRequest(visitTo: string, ltn: number, dateVisit: Date) {
  try {
    const response = await axiosInstance.post('/request/', {
      visit_to: visitTo,
      LTN: ltn,
      date_visit: dateVisit
    }, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}

export async function getApprovedRequests() {
  try {
    const response = await axiosInstance.get('/request/approvedRequests', {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}

export async function getByStatusRequests(status: string) {
  try {
    const response = await axiosInstance.get(`request/status/${status}`, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}

export async function getRequestById(id: string) {
  try {
    const response = await axiosInstance.get(`request/${id}`, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}

export async function validateRequestById(id: string, status: string) {
  try {
    const response = await axiosInstance.put(`request/status/${id}`, {
      status
    }, {
      headers: {
        ContentType: 'application/json',
        AuthorizationRequired: true
      }
    });

    return await response.data;

  } catch (error) {
    throw Error(error.response.data.error)
  }
}