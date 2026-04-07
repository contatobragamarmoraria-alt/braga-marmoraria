const url = 'https://ibonuslhvkdiyojztdyo.supabase.co/rest/v1/projects';
const key = 'sb_publishable_Bwrf_j71ICiW8MH8YgLT7w_sE4B0PDG';

fetch(url, { 
  method: 'POST', 
  headers: { 
    'apikey': key, 
    'Authorization': 'Bearer ' + key, 
    'Content-Type': 'application/json', 
    'Prefer': 'return=representation' 
  }, 
  body: JSON.stringify({ name: 'TEST', status: 'PRODUCAO' }) 
})
  .then(res => res.text())
  .then(text => console.log('POST RESPONSE:', text))
  .catch(err => console.error(err));
