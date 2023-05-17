import $api from "./api.service";
import accessToken from "./token.service";

export async function register(data) {
  const response = await $api.post('/user/register', {
    name: data.get('name'),
    email: data.get('email'),
    password: data.get('password'),
    password_confirmation: data.get('password_confirmation'),
  });

  if (response.message === 'success') {
    accessToken(response.data.token)
    $api.setAuthorization()
  }
  return response
}

export async function login(data) {
  const response = await $api.post('/user/login', {
    emailormobile: data.get('email'),
    password: data.get('password'),
    country_id: 18,
  });

  if (response.message === 'success') {
    accessToken(response.data.token)
    $api.setAuthorization()
  }
  return response
}

export async function logout() {
  const response = await $api.post('/logout', {});

  if (response.message === 'success') accessToken(null, true)
  return response
}

export async function getUser() {
  const notifyPayload = {
    showSuccess: false,
    showError: false,
    successMessage: 'Success!',
    errorMessage: 'Some Error Occurred!'
  }

  const response = await $api.get('/user/detail', notifyPayload);

  if (response.message === 'success') return response
  else accessToken(null, true)
  return response
}

