export const GrantsAbi = [
  { "type":"event","name":"GrantCreated","inputs":[
    {"indexed":false,"name":"grantId","type":"uint256"},
    {"indexed":false,"name":"org","type":"address"},
    {"indexed":false,"name":"token","type":"address"},
    {"indexed":false,"name":"amount","type":"uint256"},
    {"indexed":false,"name":"uri","type":"string"}] },
  { "type":"function","stateMutability":"nonpayable","name":"createGrant",
    "inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"uri","type":"string"}],
    "outputs":[{"type":"uint256"}] },
  { "type":"function","stateMutability":"payable","name":"fund","inputs":[{"name":"grantId","type":"uint256"}],"outputs":[] },
  { "type":"function","stateMutability":"nonpayable","name":"release","inputs":[{"name":"grantId","type":"uint256"},{"name":"to","type":"address"}],"outputs":[] }
] as const;
