import axios from 'axios';

export async function getHooks(organization, token, config) {
  const url = `https://api.github.com/orgs/${organization}/hooks`;
  const headers = { Authorization: token };
  const response = await axios.get(url, { headers });
  return response.data.filter(hook => hook.config.url === config.payloadUrl);
}

export async function createHook(organization, token, config) {
  try {
    const url = `https://api.github.com/orgs/${organization}/hooks`;
    const headers = { Authorization: token };
    await axios.post(url, {
      name: 'web',
      events: ['*'],
      config: {
        url: config.payloadUrl,
        content_type: 'json',
      },
    }, { headers });
  } catch (err) {
    if (err.response.status !== 422) {
      throw err;
    }
  }
}

export async function removeHook(organization, token, config) {
  const url = `https://api.github.com/orgs/${organization}/hooks`;
  const headers = { Authorization: token };
  const hooks = await getHooks(organization, token, config);
  return Promise.all(hooks.map(async (hook) => {
    await axios.delete(`${url}/${hook.id}`, { headers });
  }));
}
