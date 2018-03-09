import axios from 'axios';

export async function getHooks(organization, token, config) {
  const url = `api.github.com/orgs/${organization}/hooks`;
  const headers = { Authorization: `token ${token}` };
  const response = axios.get(url, { headers });
  return response.data.filter(hook => hook.config.url === config.payloadUrl);
}

export async function createHook(organization, token, config) {
  const url = `api.github.com/orgs/${organization}/hooks`;
  const headers = { Authorization: `token ${token}` };
  return axios.post(url, {
    name: 'web',
    events: ['*'],
    config: {
      url: config.payloadUrl,
      content_type: 'json',
    },
  }, { headers });
}

export async function removeHook(organization, token, config) {
  const url = `api.github.com/orgs/${organization}/hooks`;
  const headers = { Authorization: `token ${token}` };
  const hooks = await getHooks(organization, token, config);
  return Promise.all(hooks.map(async (hook) => {
    axios.delete(`${url}/${hook.id}`, { headers });
  }));
}
